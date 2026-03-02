import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ShoppingBag, ArrowRight, ShieldCheck, Zap, Globe } from 'lucide-react';

export default function Hero() {
    return (
        <div className="relative isolate overflow-hidden bg-background">
            <div className="container mx-auto px-4 py-24 sm:py-32">
                <div className="flex flex-col items-center text-center">
                    {/* Badge */}
                    <div className="mb-8 flex">
                        <div className="relative rounded-full px-3 py-1 text-sm leading-6 text-muted-foreground ring-1 ring-border hover:ring-primary/20 transition-all">
                            Discover the new 3D Collection.{' '}
                            <Link href="/assets?category=3d-models" className="font-semibold text-primary">
                                <span className="absolute inset-0" aria-hidden="true" />
                                Read more <span aria-hidden="true">&rarr;</span>
                            </Link>
                        </div>
                    </div>

                    {/* Heading */}
                    <h1 className="text-4xl font-black tracking-tight text-foreground sm:text-7xl max-w-4xl leading-[1.1]">
                        Elevate Your <span className="text-primary italic">Projects</span> with Premium Digital Assets
                    </h1>

                    {/* Subheading */}
                    <p className="mt-8 text-lg leading-8 text-muted-foreground max-w-2xl">
                        ProSets is the premier marketplace for high-performance 3D models, production-ready code snippets, and expert Notion templates. Secure, verified, and ready to use.
                    </p>

                    {/* CTA Buttons */}
                    <div className="mt-10 flex items-center justify-center gap-x-6">
                        <Button size="lg" className="h-12 px-8 text-base font-bold shadow-lg shadow-primary/20" asChild>
                            <Link href="/assets">
                                Browse Catalogue
                                <ShoppingBag className="ml-2 h-5 w-5" />
                            </Link>
                        </Button>
                        <Button size="lg" variant="ghost" className="h-12 px-8 text-base font-semibold" asChild>
                            <Link href="/about">
                                Our Mission
                                <ArrowRight className="ml-2 h-5 w-5" />
                            </Link>
                        </Button>
                    </div>

                    {/* Trust Badges */}
                    <div className="mt-20 grid grid-cols-1 gap-8 sm:grid-cols-3 w-full max-w-4xl border-t pt-12">
                        <div className="flex items-center justify-center gap-3">
                            <ShieldCheck className="h-6 w-6 text-primary" />
                            <div className="text-left font-medium">Verified Assets</div>
                        </div>
                        <div className="flex items-center justify-center gap-3">
                            <Zap className="h-6 w-6 text-primary" />
                            <div className="text-left font-medium">Instant Delivery</div>
                        </div>
                        <div className="flex items-center justify-center gap-3">
                            <Globe className="h-6 w-6 text-primary" />
                            <div className="text-left font-medium">Global Community</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Background Decor */}
            <div
                className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
                aria-hidden="true"
            >
                <div
                    className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-primary to-[#ff80b5] opacity-20 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
                    style={{
                        clipPath:
                            'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
                    }}
                />
            </div>
        </div>
    );
}
