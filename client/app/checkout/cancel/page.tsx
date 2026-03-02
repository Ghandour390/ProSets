import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { XCircle, ShoppingBag, ArrowLeft } from 'lucide-react';

export default function CancelPage() {
    return (
        <div className="container mx-auto px-4 py-24 flex flex-col items-center justify-center min-h-[60vh] text-center">
            <div className="mb-8 p-4 rounded-full bg-destructive/10">
                <XCircle className="h-16 w-16 text-destructive" />
            </div>

            <h1 className="text-4xl font-black tracking-tight mb-4">Payment <span className="text-destructive italic">Cancelled</span></h1>
            <p className="text-lg text-muted-foreground max-w-md mb-12">
                No worries! Your order has been cancelled and no charges were made. You can return to the catalogue to continue browsing.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" variant="default" className="h-12 px-8 font-bold" asChild>
                    <Link href="/assets">
                        <ShoppingBag className="mr-2 h-5 w-5" />
                        Back to Catalogue
                    </Link>
                </Button>
            </div>
        </div>
    );
}
