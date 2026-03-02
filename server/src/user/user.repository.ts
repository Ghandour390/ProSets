import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Role } from '@prisma/client';

@Injectable()
export class UserRepository {
    constructor(private prisma: PrismaService) { }

    async findByAuth0Id(auth0Id: string) {
        return this.prisma.user.findUnique({ where: { auth0Id } });
    }

    async upsert(data: { auth0Id: string; email: string; role?: Role }) {
        return this.prisma.user.upsert({
            where: { auth0Id: data.auth0Id },
            update: { email: data.email },
            create: {
                auth0Id: data.auth0Id,
                email: data.email,
                role: data.role ?? 'BUYER',
            },
        });
    }

    async findById(id: string) {
        return this.prisma.user.findUnique({ where: { id } });
    }
}
