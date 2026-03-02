'use client';

import { useEffect, useState } from 'react';
import {
    ShieldCheck,
    Search,
    CheckCircle,
    XCircle,
    ExternalLink,
    Filter,
    MoreVertical,
    Eye
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import api from '@/lib/api';
import { Skeleton } from '@/components/ui/skeleton';
import Link from 'next/link';
import Image from 'next/image';

export default function AdminPage() {
    const [assets, setAssets] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [search, setSearch] = useState('');

    useEffect(() => {
        const fetchAssets = async () => {
            try {
                const res = await api.get('/assets/admin/all');
                setAssets(res.data.data);
            } catch (error) {
                console.error('Admin fetch failed:', error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchAssets();
    }, []);

    const handleUpdateStatus = async (id: string, status: string) => {
        try {
            await api.patch(`/assets/${id}/moderate`, { status });
            setAssets(assets.map(a => a.id === id ? { ...a, status } : a));
        } catch (error) {
            console.error('Moderation failed:', error);
            alert('Failed to update status.');
        }
    };

    const filteredAssets = assets.filter(a =>
        a.title.toLowerCase().includes(search.toLowerCase()) ||
        a.seller.email.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="container mx-auto px-4 py-12">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
                <div>
                    <div className="flex items-center gap-2 text-primary font-bold text-sm uppercase tracking-widest mb-2">
                        <ShieldCheck className="h-4 w-4" />
                        Administration
                    </div>
                    <h1 className="text-4xl font-black tracking-tight mb-2">Asset <span className="text-primary italic">Moderation</span></h1>
                    <p className="text-muted-foreground">Review and manage the marketplace catalogue.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-8">
                <Card className="border-none bg-background shadow-xl rounded-[2rem] overflow-hidden">
                    <CardHeader className="p-8 pb-4">
                        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                            <div className="relative w-full sm:w-96">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Search title or seller email..."
                                    className="pl-9 h-12 rounded-2xl bg-muted/30 border-none"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                />
                            </div>
                            <div className="flex items-center gap-2">
                                <Button variant="outline" className="rounded-xl h-12 font-bold flex gap-2">
                                    <Filter className="h-4 w-4" />
                                    Filter Status
                                </Button>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="p-0">
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader className="bg-muted/30 border-b">
                                    <TableRow>
                                        <TableHead className="px-8 font-black uppercase tracking-wider text-[10px]">Preview</TableHead>
                                        <TableHead className="font-black uppercase tracking-wider text-[10px]">Asset Info</TableHead>
                                        <TableHead className="font-black uppercase tracking-wider text-[10px]">Seller</TableHead>
                                        <TableHead className="font-black uppercase tracking-wider text-[10px]">Status</TableHead>
                                        <TableHead className="text-right px-8 font-black uppercase tracking-wider text-[10px]">Moderation</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {isLoading ? (
                                        Array.from({ length: 5 }).map((_, i) => (
                                            <TableRow key={i}>
                                                <TableCell className="px-8 py-6"><Skeleton className="h-12 w-16" /></TableCell>
                                                <TableCell><Skeleton className="h-4 w-48 mb-2" /><Skeleton className="h-3 w-32" /></TableCell>
                                                <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                                                <TableCell><Skeleton className="h-6 w-20" /></TableCell>
                                                <TableCell className="text-right px-8"><Skeleton className="h-10 w-48 ml-auto" /></TableCell>
                                            </TableRow>
                                        ))
                                    ) : (
                                        filteredAssets.map((asset) => (
                                            <TableRow key={asset.id} className="hover:bg-muted/10 transition-colors border-b">
                                                <TableCell className="px-8 py-4">
                                                    <div className="relative h-12 w-16 overflow-hidden rounded-lg bg-muted border shadow-sm">
                                                        <Image src={asset.previewUrl} alt={asset.title} fill className="object-cover" />
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="font-black text-sm tracking-tight">{asset.title}</div>
                                                    <div className="text-[10px] text-muted-foreground font-black uppercase tracking-widest mt-0.5">{asset.category.name}</div>
                                                </TableCell>
                                                <TableCell className="text-sm font-medium">{asset.seller.email}</TableCell>
                                                <TableCell>
                                                    <Badge className={
                                                        asset.status === 'ACTIVE' ? 'bg-green-100 text-green-700' :
                                                            asset.status === 'PENDING' ? 'bg-orange-100 text-orange-700' :
                                                                'bg-red-100 text-red-700'
                                                    }>
                                                        {asset.status}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="text-right px-8">
                                                    <div className="flex items-center justify-end gap-2">
                                                        <Button size="sm" variant="ghost" className="rounded-lg" asChild>
                                                            <Link href={`/assets/${asset.id}`}>
                                                                <Eye className="h-4 w-4" />
                                                            </Link>
                                                        </Button>
                                                        {asset.status !== 'ACTIVE' && (
                                                            <Button
                                                                size="sm"
                                                                className="rounded-lg bg-green-600 hover:bg-green-700 font-bold"
                                                                onClick={() => handleUpdateStatus(asset.id, 'ACTIVE')}
                                                            >
                                                                <CheckCircle className="mr-1.5 h-3.5 w-3.5" /> Approve
                                                            </Button>
                                                        )}
                                                        {asset.status !== 'INACTIVE' && (
                                                            <Button
                                                                size="sm"
                                                                variant="destructive"
                                                                className="rounded-lg font-bold"
                                                                onClick={() => handleUpdateStatus(asset.id, 'INACTIVE')}
                                                            >
                                                                <XCircle className="mr-1.5 h-3.5 w-3.5" /> Reject
                                                            </Button>
                                                        )}
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
