'use client';

import { useEffect, useState } from 'react';
import {
    PlusCircle,
    MoreVertical,
    Edit2,
    Trash2,
    ExternalLink,
    Search,
    CheckCircle2,
    Clock,
    AlertCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import api from '@/lib/api';
import { Skeleton } from '@/components/ui/skeleton';
import Link from 'next/link';
import Image from 'next/image';

export default function MyAssetsPage() {
    const [assets, setAssets] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [search, setSearch] = useState('');

    useEffect(() => {
        const fetchAssets = async () => {
            try {
                const res = await api.get('/assets/seller/my-assets');
                setAssets(res.data);
            } catch (error) {
                console.error('Failed to fetch assets:', error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchAssets();
    }, []);

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this asset? This action cannot be undone.')) return;

        try {
            await api.delete(`/assets/${id}`);
            setAssets(assets.filter((a) => a.id !== id));
        } catch (error) {
            console.error('Delete failed:', error);
            alert('Failed to delete asset. Please try again.');
        }
    };

    const filteredAssets = assets.filter((asset) =>
        asset.title.toLowerCase().includes(search.toLowerCase())
    );

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'ACTIVE':
                return (
                    <Badge className="bg-green-100 text-green-700 border-none shadow-none font-black text-[10px] tracking-widest px-3 py-1 uppercase flex items-center gap-1.5 ring-1 ring-green-600/20">
                        <CheckCircle2 className="h-3 w-3" />
                        Live
                    </Badge>
                );
            case 'PENDING':
                return (
                    <Badge className="bg-orange-100 text-orange-700 border-none shadow-none font-black text-[10px] tracking-widest px-3 py-1 uppercase flex items-center gap-1.5 ring-1 ring-orange-600/20">
                        <Clock className="h-3 w-3" />
                        Reviewing
                    </Badge>
                );
            case 'INACTIVE':
                return (
                    <Badge className="bg-muted text-muted-foreground border-none shadow-none font-black text-[10px] tracking-widest px-3 py-1 uppercase flex items-center gap-1.5 ring-1 ring-border">
                        <AlertCircle className="h-3 w-3" />
                        Paused
                    </Badge>
                );
            default:
                return <Badge variant="outline">{status}</Badge>;
        }
    };

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-black tracking-tight mb-2">My <span className="text-primary italic">Assets</span></h1>
                    <p className="text-muted-foreground">Manage your catalogue and track asset status.</p>
                </div>
                <Button size="lg" className="rounded-2xl font-black h-12 shadow-xl shadow-primary/20" asChild>
                    <Link href="/seller/assets/new">
                        <PlusCircle className="mr-2 h-5 w-5" />
                        New Asset
                    </Link>
                </Button>
            </div>

            <Card className="border-none bg-background shadow-md rounded-3xl overflow-hidden">
                <CardHeader className="p-8 pb-4">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search your assets..."
                            className="pl-9 h-11 rounded-xl bg-muted/30 border-none focus-visible:ring-1"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader className="bg-muted/30 border-b">
                                <TableRow>
                                    <TableHead className="w-[100px] px-8 font-black uppercase tracking-wider text-[10px]">Asset</TableHead>
                                    <TableHead className="font-black uppercase tracking-wider text-[10px]">Title</TableHead>
                                    <TableHead className="font-black uppercase tracking-wider text-[10px]">Category</TableHead>
                                    <TableHead className="font-black uppercase tracking-wider text-[10px]">Price</TableHead>
                                    <TableHead className="font-black uppercase tracking-wider text-[10px]">Status</TableHead>
                                    <TableHead className="font-black uppercase tracking-wider text-[10px]">Created</TableHead>
                                    <TableHead className="text-right px-8 font-black uppercase tracking-wider text-[10px]">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {isLoading ? (
                                    Array.from({ length: 5 }).map((_, i) => (
                                        <TableRow key={i}>
                                            <TableCell className="px-8"><Skeleton className="h-12 w-16" /></TableCell>
                                            <TableCell><Skeleton className="h-4 w-40" /></TableCell>
                                            <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                                            <TableCell><Skeleton className="h-4 w-12" /></TableCell>
                                            <TableCell><Skeleton className="h-6 w-20" /></TableCell>
                                            <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                                            <TableCell className="text-right px-8"><Skeleton className="h-8 w-8 ml-auto" /></TableCell>
                                        </TableRow>
                                    ))
                                ) : filteredAssets.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={7} className="h-48 text-center text-muted-foreground font-medium">
                                            No assets found. Click "New Asset" to start selling.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    filteredAssets.map((asset) => (
                                        <TableRow key={asset.id} className="group hover:bg-muted/10 transition-colors">
                                            <TableCell className="px-8 py-4">
                                                <div className="relative h-12 w-16 overflow-hidden rounded-lg bg-muted border">
                                                    <Image
                                                        src={asset.previewUrl}
                                                        alt={asset.title}
                                                        fill
                                                        className="object-cover"
                                                    />
                                                </div>
                                            </TableCell>
                                            <TableCell className="font-black text-sm tracking-tight">{asset.title}</TableCell>
                                            <TableCell>
                                                <Badge variant="outline" className="text-[10px] font-bold uppercase tracking-widest border-primary/20 bg-primary/5 text-primary">
                                                    {asset.category.name}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="font-bold text-primary">${asset.price.toFixed(2)}</TableCell>
                                            <TableCell>{getStatusBadge(asset.status)}</TableCell>
                                            <TableCell className="text-sm text-muted-foreground tabular-nums">
                                                {new Date(asset.createdAt).toLocaleDateString()}
                                            </TableCell>
                                            <TableCell className="text-right px-8">
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" size="icon" className="group-hover:bg-muted rounded-full">
                                                            <MoreVertical className="h-4 w-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end" className="w-48 rounded-2xl p-2 shadow-2xl">
                                                        <DropdownMenuItem asChild className="rounded-xl p-2 cursor-pointer">
                                                            <Link href={`/assets/${asset.id}`} className="flex items-center">
                                                                <ExternalLink className="mr-2 h-4 w-4" /> View Public Page
                                                            </Link>
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem className="rounded-xl p-2 cursor-pointer">
                                                            <Edit2 className="mr-2 h-4 w-4" /> Edit Details
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem
                                                            className="rounded-xl p-2 cursor-pointer text-destructive focus:text-destructive focus:bg-destructive/10"
                                                            onClick={() => handleDelete(asset.id)}
                                                        >
                                                            <Trash2 className="mr-2 h-4 w-4" /> Delete Asset
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
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
    );
}
