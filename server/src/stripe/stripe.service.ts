import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';

@Injectable()
export class StripeService {
    private readonly logger = new Logger(StripeService.name);
    private stripe: Stripe;

    constructor(private config: ConfigService) {
        this.stripe = new Stripe(this.config.get<string>('STRIPE_SECRET_KEY', ''), {
            apiVersion: '2025-02-24.acacia' as any,
        });
    }

    /**
     * Create a Stripe Checkout session for purchasing an asset
     */
    async createCheckoutSession(params: {
        assetTitle: string;
        assetPrice: number; // in currency units (e.g. 29.99)
        orderId: string;
        buyerEmail?: string;
    }): Promise<{ sessionId: string; url: string }> {
        const session = await this.stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            mode: 'payment',
            customer_email: params.buyerEmail,
            line_items: [
                {
                    price_data: {
                        currency: 'usd',
                        product_data: {
                            name: params.assetTitle,
                        },
                        unit_amount: Math.round(params.assetPrice * 100), // Convert to cents
                    },
                    quantity: 1,
                },
            ],
            metadata: {
                orderId: params.orderId,
            },
            success_url: `${this.config.get('APP_BASE_URL', 'http://localhost:5500')}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${this.config.get('APP_BASE_URL', 'http://localhost:5500')}/checkout/cancel`,
        });

        this.logger.log(`Checkout session created: ${session.id}`);
        return { sessionId: session.id, url: session.url! };
    }

    /**
     * Verify Stripe webhook signature and return the event
     */
    constructWebhookEvent(payload: Buffer, signature: string): Stripe.Event {
        const webhookSecret = this.config.get<string>('STRIPE_WEBHOOK_SECRET', '');
        return this.stripe.webhooks.constructEvent(payload, signature, webhookSecret);
    }

    /**
     * Retrieve a checkout session
     */
    async retrieveSession(sessionId: string): Promise<Stripe.Checkout.Session> {
        return this.stripe.checkout.sessions.retrieve(sessionId);
    }
}
