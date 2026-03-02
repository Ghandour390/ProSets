'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import AssetCard from '@/components/AssetCard';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Search, Filter, SlidersHorizontal, ChevronLeft, ChevronRight } from 'lucide-react';
import api from '@/lib/api';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';

function CatalogueContent() {
    const searchParams = useSearchParams();
    const router = useRouter();

    const [assets, setAssets] = useState<any[]>([]);
    const [categories, setCategories] = useState<any[]>([]);
    const [meta, setMeta] = useState<any>({ totalPages: 1, total: 0 });
    const [isLoading, setIsLoading] = useState(true);

    // Local state for filters
    const [search, setSearch] = useState(searchParams.get('search') || '');
    const [category, setCategory] = useState(searchParams.get('category') || 'all');
    const [page, setPage] = useState(Number(searchParams.get('page')) || 1);

    useEffect(() => {
        // Fetch categories for filter
        api.get('/categories').then((res) => setCategories(res.data));
    }, []);

    useEffect(() => {
        const fetchAssets = async () => {
            setIsLoading(true);
            try {
                const params: any = { page, limit: 12 };
                if (search) params.search = search;
                if (category !== 'all') params.category = category;

                const res = await api.get('/assets', { params });
                setAssets(res.data.data);
                setMeta(res.data.meta);
            } catch (error) {
                console.error('Fetch error:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchAssets();

        // Update URL
        const urlParams = new URLSearchParams();
        if (search) urlParams.set('search', search);
        if (category !== 'all') urlParams.set('category', category);
        if (page > 1) urlParams.set('page', page.toString());

        const newUrl = urlParams.toString() ? `/assets?${urlParams.toString()}` : '/assets';
        window.history.replaceState({ ...window.history.state, as: newUrl, url: newUrl }, '', newUrl);

    }, [search, category, page]);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        setPage(1);
    };

    return (
        <div className="container mx-auto px-4 py-12">
            {/* Page Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
                <div>
                    <h1 className="text-4xl font-black tracking-tight mb-2">Asset <span className="text-primary italic">Catalogue</span></h1>
                    <p className="text-muted-foreground">Discover {meta.total} premium digital assets.</p>
                </div>

                {/* Filter Bar */}
                <div className="flex flex-wrap items-center gap-3">
                    <form onSubmit={handleSearch} className="relative w-full sm:w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search assets..."
                            className="pl-9 h-11"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </form>

                    <Select value={category} onValueChange={(val) => { setCategory(val); setPage(1); }}>
                        <SelectTrigger className="w-[180px] h-11">
                            <SelectValue placeholder="Category" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Categories</SelectItem>
                            {categories.map((cat) => (
                                <SelectItem key={cat.id} value={cat.slug}>
                                    {cat.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    <Button variant="outline" className="h-11" onClick={() => { setSearch(''); setCategory('all'); setPage(1); }}>
                        Clear
                    </Button>
                </div>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {isLoading
                    ? Array.from({ length: 8 }).map((_, i) => (
                        <div key={i} className="flex flex-col space-y-4">
                            <Skeleton className="h-[220px] w-full rounded-2xl" />
                            <Skeleton className="h-5 w-3/4" />
                            <Skeleton className="h-5 w-1/2" />
                        </div>
                    ))
                    : assets.map((asset) => (
                        <AssetCard key={asset.id} asset={asset} />
                    ))}
            </div>

            {/* Empty State */}
            {!isLoading && assets.length === 0 && (
                <div className="text-center py-32 rounded-3xl bg-muted/30 border-2 border-dashed">
                    <Filter className="h-12 w-12 mx-auto text-muted-foreground mb-4 opacity-50" />
                    <h3 className="text-xl font-bold mb-1">No matches found</h3>
                    <p className="text-muted-foreground">Try adjusting your filters or search terms.</p>
                    <Button variant="link" className="mt-4" onClick={() => { setSearch(''); setCategory('all'); }}>
                        Reset all filters
                    </Button>
                </div>
            )}

            {/* Pagination */}
            {meta.totalPages > 1 && (
                <div className="mt-16 flex items-center justify-center gap-2">
                    <Button
                        variant="outline"
                        size="icon"
                        disabled={page === 1}
                        onClick={() => setPage(page - 1)}
                    >
                        <ChevronLeft className="h-4 w-4" />
                    </Button>

                    {Array.from({ length: meta.totalPages }).map((_, i) => (
                        <Button
                            key={i}
                            variant={page === i + 1 ? 'default' : 'outline'}
                            className="w-10"
                            onClick={() => setPage(i + 1)}
                        >
                            {i + 1}
                        </Button>
                    ))}

                    <Button
                        variant="outline"
                        size="icon"
                        disabled={page === meta.totalPages}
                        onClick={() => setPage(page + 1)}
                    >
                        <ChevronRight className="h-4 w-4" />
                    </Button>
                </div>
            )}
        </div>
    );
}

export default function CataloguePage() {
    return (
        <Suspense fallback={<div className="p-12">Loading catalogue...</div>}>
            <CatalogueContent />
        </Suspense>
    );
}
