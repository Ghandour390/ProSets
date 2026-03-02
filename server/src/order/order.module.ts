import { Module } from '@nestjs/common';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { OrderRepository } from './order.repository';
import { StripeModule } from '../stripe/stripe.module';
import { AssetModule } from '../asset/asset.module';

@Module({
    imports: [StripeModule, AssetModule],
    controllers: [OrderController],
    providers: [OrderService, OrderRepository],
    exports: [OrderService],
})
export class OrderModule { }
