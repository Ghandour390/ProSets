'use client';

import { useEffect, useState } from 'react';
import Hero from '@/components/Hero';
import FeaturedCategories from '@/components/FeaturedCategories';
import AssetCard from '@/components/AssetCard';
import { Button } from '@/components/ui/button';
import { ArrowRight, Sparkles } from 'lucide-react';
import Link from 'next/link';
import api from '@/lib/api';
import { Skeleton } from '@/components/ui/skeleton';

export default function Home() {
  const [assets, setAssets] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAssets = async () => {
      try {
        const res = await api.get('/assets?limit=6');
        setAssets(res.data.data);
      } catch (error) {
        console.error('Failed to fetch assets:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchAssets();
  }, []);

  return (
    <div className="flex flex-col">
      <Hero />

      <FeaturedCategories />

      {/* Featured Assets Section */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="flex items-end justify-between mb-12">
            <div>
              <div className="flex items-center gap-2 text-primary font-bold text-sm uppercase tracking-wider mb-2">
                <Sparkles className="h-4 w-4" />
                Latest Releases
              </div>
              <h2 className="text-3xl font-black tracking-tight sm:text-4xl">
                Fresh out of the <span className="text-primary italic">Forge</span>
              </h2>
            </div>
            <Button variant="ghost" className="font-bold group" asChild>
              <Link href="/assets">
                View all assets
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
          </div>

          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {isLoading
              ? Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="flex flex-col space-y-3">
                  <Skeleton className="h-[250px] w-full rounded-xl" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              ))
              : assets.map((asset) => (
                <AssetCard key={asset.id} asset={asset} />
              ))}
          </div>

          {!isLoading && assets.length === 0 && (
            <div className="text-center py-20 bg-muted/20 rounded-3xl border-2 border-dashed">
              <p className="text-muted-foreground">No assets found yet. Be the first to upload!</p>
              <Button className="mt-4" asChild>
                <Link href="/seller/assets/new">Upload Now</Link>
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-black tracking-tight sm:text-5xl mb-6">
            Ready to monetize your <span className="text-black italic">creativity</span>?
          </h2>
          <p className="text-xl mb-10 opacity-90 max-w-2xl mx-auto">
            Join our community of elite creators and start selling your digital assets today. We handle the payments and delivery, you handle the magic.
          </p>
          <Button size="lg" variant="secondary" className="h-14 px-12 text-lg font-black" asChild>
            <Link href="/api/auth/login">Become a Seller</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
