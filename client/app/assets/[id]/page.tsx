'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import {
    ShoppingCart,
    ArrowLeft,
    Calendar,
    Tag,
    User,
    Server,
    ChevronRight,
    ShieldCheck,
    Zap,
    Download
} from 'lucide-react';
import api from '@/lib/api';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from '@/components/ui/use-toast';
import { useUser } from '@auth0/nextjs-auth0/client';

export default function AssetDetailPage() {
    const { id } = useParams();
    const router = useRouter();
    const { user } = useUser();
    const [asset, setAsset] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isBuying, setIsBuying] = useState(false);

    useEffect(() => {
        const fetchAsset = async () => {
            try {
                const res = await api.get(`/assets/${id}`);
                setAsset(res.data);
            } catch (error) {
                console.error('Failed to fetch asset:', error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchAsset();
    }, [id]);

    const handlePurchase = async () => {
        if (!user) {
            window.location.href = `/api/auth/login?returnTo=/assets/${id}`;
            return;
        }

        setIsBuying(true);
        try {
            const res = await api.post('/orders/checkout', { assetId: id });
            if (res.data.url) {
                window.location.href = res.data.url;
            }
        } catch (error: any) {
            console.error('Purchase failed:', error);
            alert('Failed to initiate checkout. Please try again.');
        } finally {
            setIsBuying(false);
        }
    };

    if (isLoading) {
        return (
            <div className="container mx-auto px-4 py-12">
                <Skeleton className="h-8 w-24 mb-8" />
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    <Skeleton className="aspect-[4/3] rounded-3xl" />
                    <div className="space-y-6">
                        <Skeleton className="h-10 w-3/4" />
                        <Skeleton className="h-6 w-1/4" />
                        <Skeleton className="h-32 w-full" />
                        <Skeleton className="h-14 w-full" />
                    </div>
                </div>
            </div>
        );
    }

    if (!asset) return <div className="p-20 text-center">Asset not found.</div>;

    return (
        <div className="container mx-auto px-4 py-12">
            {/* Back Button */}
            <Button
                variant="ghost"
                className="mb-8 pl-0 hover:bg-transparent"
                onClick={() => router.back()}
            >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to catalogue
            </Button>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:items-start">
                {/* Left: Preview */}
                <div className="space-y-6">
                    <div className="relative aspect-[4/3] overflow-hidden rounded-3xl border shadow-2xl">
                        <Image
                            src={asset.previewUrl}
                            alt={asset.title}
                            fill
                            className="object-cover"
                            priority
                        />
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                        <div className="flex flex-col items-center justify-center p-4 rounded-2xl bg-muted/50 border text-center">
                            <ShieldCheck className="h-6 w-6 text-primary mb-2" />
                            <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-tighter">Verified</span>
                        </div>
                        <div className="flex flex-col items-center justify-center p-4 rounded-2xl bg-muted/50 border text-center">
                            <Zap className="h-6 w-6 text-primary mb-2" />
                            <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-tighter">Instant</span>
                        </div>
                        <div className="flex flex-col items-center justify-center p-4 rounded-2xl bg-muted/50 border text-center">
                            <Download className="h-6 w-6 text-primary mb-2" />
                            <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-tighter">Secure</span>
                        </div>
                    </div>
                </div>

                {/* Right: Details */}
                <div className="space-y-8">
                    <div>
                        <Badge variant="secondary" className="mb-4 h-7 px-4 rounded-full bg-primary/10 text-primary border-none font-bold">
                            {asset.category.name}
                        </Badge>
                        <h1 className="text-4xl font-black tracking-tight lg:text-5xl mb-4">{asset.title}</h1>
                        <p className="text-lg text-muted-foreground leading-relaxed whitespace-pre-wrap">
                            {asset.description}
                        </p>
                    </div>

                    <Card className="border-none bg-muted/50 rounded-3xl">
                        <CardContent className="p-8">
                            <div className="flex items-end justify-between mb-8">
                                <div>
                                    <p className="text-sm font-bold text-muted-foreground uppercase tracking-[0.2em] mb-1">One-time payment</p>
                                    <div className="text-5xl font-black text-primary">${asset.price.toFixed(2)}</div>
                                </div>
                                <Badge className="h-8 px-4 rounded-full text-sm font-black bg-background text-foreground border shadow-sm">
                                    LIFETIME ACCESS
                                </Badge>
                            </div>

                            <Button
                                onClick={handlePurchase}
                                disabled={isBuying}
                                className="w-full h-16 text-xl font-black rounded-2xl shadow-xl shadow-primary/20"
                            >
                                {isBuying ? (
                                    "Initiating..."
                                ) : (
                                    <>
                                        <ShoppingCart className="mr-3 h-6 w-6" />
                                        Buy Now
                                    </>
                                )}
                            </Button>
                            <p className="text-center text-xs text-muted-foreground mt-4 flex items-center justify-center gap-1">
                                <ShieldCheck className="h-3 w-3" /> Secure checkout powered by Stripe
                            </p>
                        </CardContent>
                    </Card>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="flex items-center gap-3 p-4 rounded-2xl border bg-background">
                            <User className="h-5 w-5 text-muted-foreground" />
                            <div>
                                <p className="text-[10px] uppercase font-bold text-muted-foreground">Seller</p>
                                <p className="text-sm font-bold">{asset.seller.email.split('@')[0]}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 p-4 rounded-2xl border bg-background">
                            <Calendar className="h-5 w-5 text-muted-foreground" />
                            <div>
                                <p className="text-[10px] uppercase font-bold text-muted-foreground">Updated</p>
                                <p className="text-sm font-bold">{new Date(asset.createdAt || Date.now()).toLocaleDateString()}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
