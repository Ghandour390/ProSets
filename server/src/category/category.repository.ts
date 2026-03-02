import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CategoryRepository {
    constructor(private prisma: PrismaService) { }

    async findAll() {
        return this.prisma.category.findMany();
    }

    async findById(id: string) {
        return this.prisma.category.findUnique({ where: { id } });
    }

    async findBySlug(slug: string) {
        return this.prisma.category.findUnique({ where: { slug } });
    }

    async create(data: { name: string; slug: string }) {
        return this.prisma.category.create({ data });
    }

    async update(id: string, data: { name?: string; slug?: string }) {
        return this.prisma.category.update({ where: { id }, data });
    }

    async delete(id: string) {
        return this.prisma.category.delete({ where: { id } });
    }
}
