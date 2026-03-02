'use client';

import { useEffect, useState } from 'react';
import { useUser } from '@auth0/nextjs-auth0/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import {
    Download,
    ExternalLink,
    ShoppingBag,
    Clock,
    CheckCircle2,
    Search,
    Loader2
} from 'lucide-react';
import api from '@/lib/api';
import { Skeleton } from '@/components/ui/skeleton';
import Link from 'next/link';
import Image from 'next/image';

export default function DashboardPage() {
    const { user, isLoading: userLoading } = useUser();
    const [orders, setOrders] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isDownloading, setIsDownloading] = useState<string | null>(null);

    useEffect(() => {
        if (user) {
            const fetchOrders = async () => {
                try {
                    const res = await api.get('/orders/user/purchases');
                    setOrders(res.data);
                } catch (error) {
                    console.error('Failed to fetch orders:', error);
                } finally {
                    setIsLoading(false);
                }
            };
            fetchOrders();
        }
    }, [user]);

    const handleDownload = async (orderId: string) => {
        setIsDownloading(orderId);
        try {
            const res = await api.get(`/orders/${orderId}/download`);
            if (res.data.downloadUrl) {
                window.open(res.data.downloadUrl, '_blank');
            }
        } catch (error) {
            console.error('Download failed:', error);
            alert('Failed to generate download link. Please contact support.');
        } finally {
            setIsDownloading(null);
        }
    };

    if (userLoading) return <div className="p-20 text-center">Loading user...</div>;
    if (!user) return <div className="p-20 text-center">Please log in to view your purchases.</div>;

    return (
        <div className="container mx-auto px-4 py-12">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
                <div>
                    <h1 className="text-4xl font-black tracking-tight mb-2">My <span className="text-primary italic">Purchases</span></h1>
                    <p className="text-muted-foreground">Manage and download your digital collection.</p>
                </div>
                <Button variant="outline" asChild>
                    <Link href="/assets">
                        <Search className="mr-2 h-4 w-4" />
                        Find more assets
                    </Link>
                </Button>
            </div>

            <div className="space-y-6">
                {isLoading ? (
                    Array.from({ length: 3 }).map((_, i) => (
                        <Skeleton key={i} className="h-32 w-full rounded-3xl" />
                    ))
                ) : orders.length === 0 ? (
                    <Card className="border-none bg-muted/30 rounded-3xl py-20 text-center">
                        <CardContent>
                            <ShoppingBag className="h-12 w-12 mx-auto text-muted-foreground mb-4 opacity-50" />
                            <h3 className="text-xl font-bold mb-2">No purchases yet</h3>
                            <p className="text-muted-foreground mb-8">Start building your collection today.</p>
                            <Button size="lg" className="rounded-2xl px-12 font-bold" asChild>
                                <Link href="/assets">Browse Catalogue</Link>
                            </Button>
                        </CardContent>
                    </Card>
                ) : (
                    orders.map((order) => (
                        <Card key={order.id} className="overflow-hidden border-none bg-background shadow-md hover:shadow-lg transition-shadow rounded-3xl">
                            <CardContent className="p-0">
                                <div className="flex flex-col sm:flex-row">
                                    {/* Aspect ratio preview */}
                                    <div className="relative w-full sm:w-48 aspect-video sm:aspect-square bg-muted">
                                        <Image
                                            src={order.asset.previewUrl}
                                            alt={order.asset.title}
                                            fill
                                            className="object-cover"
                                        />
                                    </div>

                                    {/* Details */}
                                    <div className="flex-1 p-6 flex flex-col justify-between">
                                        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                                            <div>
                                                <div className="flex items-center gap-2 mb-1">
                                                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                                                    <span className="text-[10px] font-black uppercase tracking-widest text-green-600">Paid Order</span>
                                                </div>
                                                <h3 className="text-xl font-bold mb-1">{order.asset.title}</h3>
                                                <p className="text-sm text-muted-foreground line-clamp-1">
                                                    Purchased on {new Date(order.createdAt).toLocaleDateString()}
                                                </p>
                                            </div>
                                            <div className="text-right">
                                                <div className="text-2xl font-black text-primary">${order.asset.price.toFixed(2)}</div>
                                            </div>
                                        </div>

                                        <div className="mt-6 flex flex-wrap items-center gap-3">
                                            <Button
                                                size="lg"
                                                className="rounded-2xl font-bold h-12 px-6"
                                                onClick={() => handleDownload(order.id)}
                                                disabled={isDownloading === order.id}
                                            >
                                                {isDownloading === order.id ? (
                                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                ) : (
                                                    <Download className="mr-2 h-5 w-5" />
                                                )}
                                                Download Asset
                                            </Button>
                                            <Button variant="ghost" className="rounded-xl font-semibold h-12 px-6 text-muted-foreground" asChild>
                                                <Link href={`/assets/${order.asset.id}`}>
                                                    <ExternalLink className="mr-2 h-4 w-4" />
                                                    View Page
                                                </Link>
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))
                )}
            </div>

            <div className="mt-20 p-8 rounded-3xl bg-primary/5 border border-primary/10 flex flex-col md:flex-row items-center gap-8">
                <div className="p-4 rounded-2xl bg-primary/10">
                    <Clock className="h-8 w-8 text-primary" />
                </div>
                <div className="text-center md:text-left flex-1">
                    <h3 className="text-xl font-bold mb-1 tracking-tight">Need help with your download?</h3>
                    <p className="text-muted-foreground text-sm">
                        Download links are unique and expire after 5 minutes for security. If your link expires, just click "Download Asset" again to regenerate a new one.
                    </p>
                </div>
                <Button variant="outline" className="rounded-xl font-bold">Contact Support</Button>
            </div>
        </div>
    );
}
