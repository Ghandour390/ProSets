'use client';

import { useEffect, useState } from 'react';
import {
    DollarSign,
    ShoppingBag,
    Package,
    Clock,
    TrendingUp,
    CreditCard,
    ArrowUpRight
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import api from '@/lib/api';
import { Skeleton } from '@/components/ui/skeleton';
import Link from 'next/link';

export default function SellerOverviewPage() {
    const [stats, setStats] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await api.get('/orders/seller/sales');
                setStats(res.data);
            } catch (error) {
                console.error('Failed to fetch stats:', error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchStats();
    }, []);

    const statCards = [
        {
            title: 'Total Revenue',
            value: stats ? `$${stats.totalRevenue.toFixed(2)}` : '$0.00',
            description: 'Lifetime earnings from your assets',
            icon: DollarSign,
            color: 'text-green-600',
            bg: 'bg-green-600/10',
        },
        {
            title: 'Total Sales',
            value: stats ? stats.salesCount : 0,
            description: 'Number of individual purchases',
            icon: ShoppingBag,
            color: 'text-blue-600',
            bg: 'bg-blue-600/10',
        },
        {
            title: 'Active Assets',
            value: stats ? stats.activeAssets || 0 : 0,
            description: 'Publicly visible and buyable',
            icon: Package,
            color: 'text-purple-600',
            bg: 'bg-purple-600/10',
        },
        {
            title: 'Pending Review',
            value: stats ? stats.pendingAssets || 0 : 0,
            description: 'Assets currently in moderation',
            icon: Clock,
            color: 'text-orange-600',
            bg: 'bg-orange-600/10',
        },
    ];

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-black tracking-tight mb-2">Dashboard <span className="text-primary italic">Overview</span></h1>
                <p className="text-muted-foreground">Track your performance and manage your creative business.</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {isLoading
                    ? Array.from({ length: 4 }).map((_, i) => (
                        <Skeleton key={i} className="h-32 w-full rounded-2xl" />
                    ))
                    : statCards.map((stat, i) => (
                        <Card key={i} className="border-none bg-background shadow-sm rounded-2xl">
                            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                                <CardTitle className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
                                    {stat.title}
                                </CardTitle>
                                <div className={`p-2 rounded-xl ${stat.bg}`}>
                                    <stat.icon className={`h-4 w-4 ${stat.color}`} />
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="text-3xl font-black">{stat.value}</div>
                                <p className="text-xs text-muted-foreground mt-1">
                                    {stat.description}
                                </p>
                            </CardContent>
                        </Card>
                    ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Quick Actions */}
                <Card className="lg:col-span-1 border-none bg-primary text-primary-foreground rounded-3xl overflow-hidden relative shadow-lg">
                    <CardContent className="p-8 relative z-10">
                        <SparklesIcon className="absolute -right-8 -top-8 h-48 w-48 opacity-10 rotate-12" />
                        <h2 className="text-2xl font-black mb-4">Ready to Grow?</h2>
                        <p className="mb-8 opacity-90 font-medium">Upload a new digital asset and reach thousands of professional buyers.</p>
                        <Button size="lg" variant="secondary" className="w-full h-12 font-black rounded-xl" asChild>
                            <Link href="/seller/assets/new">
                                <PlusCircle className="mr-2 h-5 w-5" />
                                Upload New Asset
                            </Link>
                        </Button>
                    </CardContent>
                </Card>

                {/* Recent Activity Placeholder */}
                <Card className="lg:col-span-2 border-none bg-background shadow-sm rounded-3xl">
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle className="text-xl font-black">Recent Activity</CardTitle>
                                <CardDescription>Latest updates on your assets and sales</CardDescription>
                            </div>
                            <Button variant="ghost" size="sm" className="font-bold text-primary hover:bg-primary/10">
                                View all <ArrowUpRight className="ml-1 h-3 w-3" />
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-col items-center justify-center py-12 text-center text-muted-foreground">
                            <TrendingUp className="h-12 w-12 mb-4 opacity-20" />
                            <p className="font-medium">No recent activity found.</p>
                            <p className="text-xs">Sales and asset status changes will appear here.</p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

function SparklesIcon(props: any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
            <path d="M5 3v4" />
            <path d="M19 17v4" />
            <path d="M3 5h4" />
            <path d="M17 19h4" />
        </svg>
    );
}
