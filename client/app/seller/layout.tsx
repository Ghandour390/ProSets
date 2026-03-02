'use client';

import { useUser } from '@auth0/nextjs-auth0/client';
import SellerSidebar from '@/components/SellerSidebar';
import { redirect } from 'next/navigation';
import { Loader2 } from 'lucide-react';

export default function SellerLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { user, isLoading } = useUser();

    if (isLoading) {
        return (
            <div className="flex h-screen w-full items-center justify-center">
                <Loader2 className="h-10 w-10 animate-spin text-primary" />
            </div>
        );
    }

    // Redirect if not logged in
    if (!user) {
        redirect('/api/auth/login?returnTo=/seller');
    }

    // In a real app, we would verify the 'SELLER' or 'ADMIN' role here.
    // For this project, we'll assume the user is a seller for demo purposes.

    return (
        <div className="flex h-[calc(100vh-4rem)]">
            <div className="hidden md:flex flex-col w-72">
                <SellerSidebar />
            </div>
            <main className="flex-1 overflow-y-auto bg-muted/10 p-8">
                {children}
            </main>
        </div>
    );
}
