import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { OrderStatus } from '@prisma/client';

@Injectable()
export class OrderRepository {
    constructor(private prisma: PrismaService) { }

    async create(data: {
        buyerId: string;
        assetId: string;
        stripeSessionId: string;
    }) {
        return this.prisma.order.create({
            data: {
                ...data,
                status: OrderStatus.PENDING,
            },
        });
    }

    async findByStripeSessionId(stripeSessionId: string) {
        return this.prisma.order.findUnique({
            where: { stripeSessionId },
            include: { asset: true },
        });
    }

    async findById(id: string) {
        return this.prisma.order.findUnique({
            where: { id },
            include: { asset: true },
        });
    }

    async findByIdWithAsset(id: string) {
        return this.prisma.order.findUnique({
            where: { id },
            include: { asset: true, buyer: true },
        });
    }

    async updateStatus(id: string, status: OrderStatus) {
        return this.prisma.order.update({ where: { id }, data: { status } });
    }

    async updateStripeSessionId(id: string, stripeSessionId: string) {
        return this.prisma.order.update({ where: { id }, data: { stripeSessionId } });
    }

    async findByBuyerId(buyerId: string) {
        return this.prisma.order.findMany({
            where: { buyerId },
            include: { asset: { include: { category: true } } },
            orderBy: { createdAt: 'desc' },
        });
    }

    async findPaidByBuyerAndAsset(buyerId: string, assetId: string) {
        return this.prisma.order.findFirst({
            where: {
                buyerId,
                assetId,
                status: OrderStatus.PAID,
            },
        });
    }

    async findBySellerAssets(sellerId: string) {
        return this.prisma.order.findMany({
            where: {
                asset: { sellerId },
                status: OrderStatus.PAID,
            },
            include: { asset: true, buyer: true },
            orderBy: { createdAt: 'desc' },
        });
    }

    async getSellerRevenue(sellerId: string) {
        const result = await this.prisma.order.findMany({
            where: {
                asset: { sellerId },
                status: OrderStatus.PAID,
            },
            include: { asset: { select: { price: true } } },
        });
        return {
            totalRevenue: result.reduce((sum, o) => sum + o.asset.price, 0),
            totalSales: result.length,
        };
    }
}
