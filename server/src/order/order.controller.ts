import {
    Controller, Post, Get, Body, UseGuards, Request, Param,
    RawBodyRequest, Req, Headers, BadRequestException,
} from '@nestjs/common';
import { OrderService } from './order.service';
import { AuthGuard } from '@nestjs/passport';
import { CreateOrderDto } from './dto/order.dto';
import { StripeService } from '../stripe/stripe.service';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';

@Controller('orders')
export class OrderController {
    constructor(
        private service: OrderService,
        private stripeService: StripeService,
    ) { }

    /**
     * Create a Stripe Checkout session for an asset
     */
    @UseGuards(AuthGuard('jwt'))
    @Post('checkout')
    async checkout(@Request() req: any, @Body() dto: CreateOrderDto) {
        return this.service.createCheckout(req.user.dbId, dto.assetId, req.user.email);
    }

    /**
     * Get current user's orders (purchase history)
     */
    @UseGuards(AuthGuard('jwt'))
    @Get('my-orders')
    async getMyOrders(@Request() req: any) {
        return this.service.getUserOrders(req.user.dbId);
    }

    /**
     * Get download URL for a paid order
     */
    @UseGuards(AuthGuard('jwt'))
    @Get(':orderId/download')
    async download(@Request() req: any, @Param('orderId') orderId: string) {
        return this.service.getDownloadUrl(orderId, req.user.dbId);
    }

    /**
     * Seller: get sales history and revenue
     */
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles('SELLER' as any, 'ADMIN' as any)
    @Get('seller/sales')
    async getSellerSales(@Request() req: any) {
        return this.service.getSellerSales(req.user.dbId);
    }

    /**
     * Stripe webhook — receives payment events
     * Must be public (no auth guard) but verified via Stripe signature
     */
    @Post('webhook')
    async webhook(
        @Req() req: RawBodyRequest<Request>,
        @Headers('stripe-signature') signature: string,
    ) {
        if (!signature) {
            throw new BadRequestException('Missing stripe-signature header');
        }

        try {
            const rawBody = (req as any).rawBody;
            const event = this.stripeService.constructWebhookEvent(rawBody, signature);
            await this.service.handleWebhookEvent(event);
            return { received: true };
        } catch (err: any) {
            throw new BadRequestException(`Webhook error: ${err.message}`);
        }
    }
}
