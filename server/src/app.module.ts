import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { StorageModule } from './storage/storage.module';
import { CategoryModule } from './category/category.module';
import { UserModule } from './user/user.module';
import { AssetModule } from './asset/asset.module';
import { OrderModule } from './order/order.module';
import { StripeModule } from './stripe/stripe.module';

@Module({
    imports: [
        ConfigModule.forRoot({ isGlobal: true }),
        PrismaModule,
        StorageModule,
        AuthModule,
        CategoryModule,
        UserModule,
        AssetModule,
        OrderModule,
        StripeModule,
    ],
    controllers: [],
    providers: [],
})
export class AppModule { }
