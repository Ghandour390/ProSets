import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AssetStatus, Prisma } from '@prisma/client';

@Injectable()
export class AssetRepository {
    constructor(private prisma: PrismaService) { }

    async findAllFiltered(params: {
        status?: AssetStatus;
        categorySlug?: string;
        search?: string;
        minPrice?: number;
        maxPrice?: number;
        page: number;
        limit: number;
    }) {
        const where: Prisma.AssetWhereInput = {};

        if (params.status) where.status = params.status;
        if (params.categorySlug) where.category = { slug: params.categorySlug };
        if (params.search) {
            where.OR = [
                { title: { contains: params.search, mode: 'insensitive' } },
                { description: { contains: params.search, mode: 'insensitive' } },
            ];
        }
        if (params.minPrice !== undefined || params.maxPrice !== undefined) {
            where.price = {};
            if (params.minPrice !== undefined) where.price.gte = params.minPrice;
            if (params.maxPrice !== undefined) where.price.lte = params.maxPrice;
        }

        const skip = (params.page - 1) * params.limit;

        const [data, total] = await Promise.all([
            this.prisma.asset.findMany({
                where,
                include: { category: true, seller: { select: { id: true, email: true } } },
                skip,
                take: params.limit,
                orderBy: { id: 'desc' },
            }),
            this.prisma.asset.count({ where }),
        ]);

        return {
            data,
            meta: {
                total,
                page: params.page,
                limit: params.limit,
                totalPages: Math.ceil(total / params.limit),
            },
        };
    }

    async findById(id: string) {
        return this.prisma.asset.findUnique({
            where: { id },
            include: { category: true, seller: { select: { id: true, email: true } } },
        });
    }

    async findBySellerId(sellerId: string) {
        return this.prisma.asset.findMany({
            where: { sellerId },
            include: { category: true },
            orderBy: { id: 'desc' },
        });
    }

    async create(data: {
        title: string;
        description: string;
        price: number;
        fileKey: string;
        previewUrl: string;
        sellerId: string;
        categoryId: string;
    }) {
        return this.prisma.asset.create({
            data: { ...data, status: AssetStatus.PENDING },
            include: { category: true },
        });
    }

    async update(id: string, data: Partial<{
        title: string;
        description: string;
        price: number;
        previewUrl: string;
        categoryId: string;
        status: AssetStatus;
    }>) {
        return this.prisma.asset.update({
            where: { id },
            data,
            include: { category: true },
        });
    }

    async delete(id: string) {
        return this.prisma.asset.delete({ where: { id } });
    }
}
