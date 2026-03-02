import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ShoppingCart } from 'lucide-react';

interface AssetCardProps {
    asset: {
        id: string;
        title: string;
        description: string;
        price: number;
        previewUrl: string;
        category: {
            name: string;
            slug: string;
        };
    };
}

export default function AssetCard({ asset }: AssetCardProps) {
    return (
        <Card className="group overflow-hidden border-none bg-muted/40 transition-all hover:bg-muted/60 hover:shadow-xl">
            <Link href={`/assets/${asset.id}`}>
                <CardHeader className="p-0">
                    <div className="relative aspect-[4/3] overflow-hidden">
                        <Image
                            src={asset.previewUrl}
                            alt={asset.title}
                            fill
                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                        <Badge className="absolute left-3 top-3 bg-background/80 text-foreground backdrop-blur-sm border-none shadow-sm hover:bg-background/90">
                            {asset.category.name}
                        </Badge>
                    </div>
                </CardHeader>
                <CardContent className="p-4">
                    <h3 className="line-clamp-1 text-lg font-bold tracking-tight">{asset.title}</h3>
                    <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                        {asset.description}
                    </p>
                </CardContent>
            </Link>
            <CardFooter className="flex items-center justify-between p-4 pt-0">
                <div className="text-xl font-black text-primary">
                    ${asset.price.toFixed(2)}
                </div>
                <Button size="sm" variant="secondary" className="font-semibold shadow-sm group-hover:bg-primary group-hover:text-primary-foreground">
                    <ShoppingCart className="mr-2 h-4 w-4" />
                    View
                </Button>
            </CardFooter>
        </Card>
    );
}
