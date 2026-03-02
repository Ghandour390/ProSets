import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { OrderRepository } from './order.repository';
import { OrderStatus } from '@prisma/client';
import { StripeService } from '../stripe/stripe.service';
import { StorageService } from '../storage/storage.service';
import { AssetRepository } from '../asset/asset.repository';

@Injectable()
export class OrderService {
    constructor(
        private repository: OrderRepository,
        private stripeService: StripeService,
        private storageService: StorageService,
        private assetRepository: AssetRepository,
    ) { }

    /**
     * Create an order and a Stripe Checkout session
     */
    async createCheckout(buyerId: string, assetId: string, buyerEmail?: string) {
        const asset = await this.assetRepository.findById(assetId);
        if (!asset) throw new NotFoundException('Asset not found');
        if (asset.status !== 'ACTIVE') throw new BadRequestException('Asset is not available for purchase');

        // Check if already purchased
        const existing = await this.repository.findPaidByBuyerAndAsset(buyerId, assetId);
        if (existing) throw new BadRequestException('You already own this asset');

        // Create a placeholder Stripe session ID (will be updated)
        const order = await this.repository.create({
            buyerId,
            assetId,
            stripeSessionId: `pending_${Date.now()}`,
        });

        // Create Stripe Checkout session
        const session = await this.stripeService.createCheckoutSession({
            assetTitle: asset.title,
            assetPrice: asset.price,
            orderId: order.id,
            buyerEmail,
        });

        // Update with real Stripe session ID
        await this.repository.updateStripeSessionId(order.id, session.sessionId);

        return { checkoutUrl: session.url, sessionId: session.sessionId };
    }

    /**
     * Handle Stripe webhook event
     */
    async handleWebhookEvent(event: any) {
        if (event.type === 'checkout.session.completed') {
            const session = event.data.object;
            const orderId = session.metadata?.orderId;

            if (orderId) {
                await this.repository.updateStatus(orderId, OrderStatus.PAID);
            }
        }

        if (event.type === 'checkout.session.expired') {
            const session = event.data.object;
            const orderId = session.metadata?.orderId;

            if (orderId) {
                await this.repository.updateStatus(orderId, OrderStatus.FAILED);
            }
        }
    }

    /**
     * Get a presigned download URL for a paid order
     */
    async getDownloadUrl(orderId: string, buyerId: string) {
        const order = await this.repository.findByIdWithAsset(orderId);
        if (!order) throw new NotFoundException('Order not found');
        if (order.buyerId !== buyerId) throw new ForbiddenException('Not your order');
        if (order.status !== OrderStatus.PAID) throw new ForbiddenException('Payment not completed');

        const presignedUrl = await this.storageService.getPresignedDownloadUrl(order.asset.fileKey);
        return { downloadUrl: presignedUrl, expiresIn: 300 };
    }

    /**
     * Get buyer's orders
     */
    async getUserOrders(buyerId: string) {
        return this.repository.findByBuyerId(buyerId);
    }

    /**
     * Get seller's sold orders + revenue
     */
    async getSellerSales(sellerId: string) {
        const [orders, stats] = await Promise.all([
            this.repository.findBySellerAssets(sellerId),
            this.repository.getSellerRevenue(sellerId),
        ]);
        return { orders, ...stats };
    }
}
