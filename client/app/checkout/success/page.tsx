'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { CheckCircle, Download, ArrowRight, ShoppingBag, Loader2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import api from '@/lib/api';

function SuccessContent() {
    const searchParams = useSearchParams();
    const sessionId = searchParams.get('session_id');
    const [order, setOrder] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // In a real app, we might wait for webhook or poll the backend
        // Since we're in a demo/dev flow, we'll just show a success message
        // and provide a link to the dashboard where the asset will be available.
        const timer = setTimeout(() => setIsLoading(false), 2000);
        return () => clearTimeout(timer);
    }, [sessionId]);

    return (
        <div className="container mx-auto px-4 py-24 flex flex-col items-center justify-center min-h-[60vh] text-center">
            <div className="mb-8 p-4 rounded-full bg-green-500/10">
                <CheckCircle className="h-16 w-16 text-green-500" />
            </div>

            <h1 className="text-4xl font-black tracking-tight mb-4">Payment <span className="text-primary italic">Successful</span>!</h1>
            <p className="text-lg text-muted-foreground max-w-md mb-12">
                Thank you for your purchase. Your asset is now available for download in your dashboard.
            </p>

            {isLoading ? (
                <div className="flex items-center gap-3 text-muted-foreground animate-pulse">
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Processing order...
                </div>
            ) : (
                <div className="flex flex-col sm:flex-row gap-4">
                    <Button size="lg" className="h-12 px-8 font-bold" asChild>
                        <Link href="/dashboard">
                            <ShoppingBag className="mr-2 h-5 w-5" />
                            Go to Dashboard
                        </Link>
                    </Button>
                    <Button size="lg" variant="outline" className="h-12 px-8 font-bold" asChild>
                        <Link href="/assets">
                            Continue Shopping
                            <ArrowRight className="ml-2 h-5 w-5" />
                        </Link>
                    </Button>
                </div>
            )}

            <Card className="mt-16 w-full max-w-2xl border-none bg-muted/30 rounded-3xl">
                <CardContent className="p-8 text-left">
                    <h3 className="font-bold text-lg mb-4">What's next?</h3>
                    <ul className="space-y-4">
                        <li className="flex gap-3">
                            <div className="h-6 w-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-black">1</div>
                            <p className="text-sm text-muted-foreground">Check your email for the receipt and order details.</p>
                        </li>
                        <li className="flex gap-3">
                            <div className="h-6 w-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-black">2</div>
                            <p className="text-sm text-muted-foreground">Visit your dashboard to generate your unique download link.</p>
                        </li>
                        <li className="flex gap-3">
                            <div className="h-6 w-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-black">3</div>
                            <p className="text-sm text-muted-foreground">Download links are valid for 5 minutes and can be regenerated at any time.</p>
                        </li>
                    </ul>
                </CardContent>
            </Card>
        </div>
    );
}

export default function SuccessPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <SuccessContent />
        </Suspense>
    );
}
