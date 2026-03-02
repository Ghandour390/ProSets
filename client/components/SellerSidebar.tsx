'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
    BarChart3,
    Package,
    PlusCircle,
    Settings,
    LayoutDashboard,
    ChevronRight
} from 'lucide-react';

const routes = [
    {
        label: 'Overview',
        icon: LayoutDashboard,
        href: '/seller',
        active: (pathname: string) => pathname === '/seller',
    },
    {
        label: 'My Assets',
        icon: Package,
        href: '/seller/assets',
        active: (pathname: string) => pathname === '/seller/assets',
    },
    {
        label: 'Upload New',
        icon: PlusCircle,
        href: '/seller/assets/new',
        active: (pathname: string) => pathname === '/seller/assets/new',
    },
    {
        label: 'Settings',
        icon: Settings,
        href: '/seller/settings',
        active: (pathname: string) => pathname === '/seller/settings',
    },
];

export default function SellerSidebar() {
    const pathname = usePathname();

    return (
        <div className="space-y-4 py-4 flex flex-col h-full bg-muted/30 border-r">
            <div className="px-6 py-2">
                <h2 className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground">
                    Seller Portal
                </h2>
            </div>
            <div className="flex-1 px-3">
                {routes.map((route) => (
                    <Link
                        key={route.href}
                        href={route.href}
                        className={cn(
                            "text-sm group flex p-3 w-full justify-start font-bold cursor-pointer hover:text-primary hover:bg-primary/5 rounded-xl transition-all mb-1",
                            route.active(pathname) ? "text-primary bg-primary/10" : "text-muted-foreground"
                        )}
                    >
                        <div className="flex items-center flex-1">
                            <route.icon className={cn("h-5 w-5 mr-3", route.active(pathname) ? "text-primary" : "text-muted-foreground")} />
                            {route.label}
                        </div>
                        {route.active(pathname) && <ChevronRight className="h-4 w-4" />}
                    </Link>
                ))}
            </div>
        </div>
    );
}
