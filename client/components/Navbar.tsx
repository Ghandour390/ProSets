'use client';

import Link from 'next/link';
import { useUser } from '@auth0/nextjs-auth0/client';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Search, ShoppingBag, PlusCircle, LayoutDashboard, LogOut } from 'lucide-react';
import { Input } from '@/components/ui/input';

export default function Navbar() {
    const { user, isLoading } = useUser();

    return (
        <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container mx-auto flex h-16 items-center justify-between px-4">
                {/* Logo */}
                <div className="flex items-center gap-8">
                    <Link href="/" className="flex items-center space-x-2">
                        <ShoppingBag className="h-6 w-6 text-primary" />
                        <span className="text-xl font-bold tracking-tight">ProSets</span>
                    </Link>

                    {/* Nav Links */}
                    <div className="hidden md:flex items-center space-x-6">
                        <Link href="/assets" className="text-sm font-medium transition-colors hover:text-primary">
                            Catalogue
                        </Link>
                        <Link href="/categories" className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary">
                            Categories
                        </Link>
                    </div>
                </div>

                {/* Search & Auth */}
                <div className="flex items-center gap-4">
                    <div className="relative hidden lg:block w-64">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            type="search"
                            placeholder="Search assets..."
                            className="pl-9 bg-muted/50 border-none h-9 focus-visible:ring-1"
                        />
                    </div>

                    {!isLoading && !user && (
                        <div className="flex items-center gap-2">
                            <Button variant="ghost" size="sm" asChild>
                                <a href="/api/auth/login">Log in</a>
                            </Button>
                            <Button size="sm" asChild>
                                <a href="/api/auth/login">Get Started</a>
                            </Button>
                        </div>
                    )}

                    {user && (
                        <div className="flex items-center gap-4">
                            <Button variant="ghost" size="icon" asChild className="hidden sm:inline-flex">
                                <Link href="/seller/assets/new">
                                    <PlusCircle className="h-5 w-5" />
                                </Link>
                            </Button>

                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                                        <Avatar className="h-9 w-9 border">
                                            <AvatarImage src={user.picture || ''} alt={user.name || 'User'} />
                                            <AvatarFallback>{user.name?.charAt(0) || 'U'}</AvatarFallback>
                                        </Avatar>
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className="w-56" align="end" forceMount>
                                    <DropdownMenuLabel className="font-normal">
                                        <div className="flex flex-col space-y-1">
                                            <p className="text-sm font-medium leading-none">{user.name}</p>
                                            <p className="text-xs leading-none text-muted-foreground">
                                                {user.email}
                                            </p>
                                        </div>
                                    </DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem asChild>
                                        <Link href="/dashboard" className="cursor-pointer">
                                            <ShoppingBag className="mr-2 h-4 w-4" />
                                            <span>My Purchases</span>
                                        </Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem asChild>
                                        <Link href="/seller" className="cursor-pointer">
                                            <LayoutDashboard className="mr-2 h-4 w-4" />
                                            <span>Seller Dashboard</span>
                                        </Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem asChild className="text-destructive focus:text-destructive">
                                        <a href="/api/auth/logout" className="cursor-pointer w-full flex items-center">
                                            <LogOut className="mr-2 h-4 w-4" />
                                            <span>Log out</span>
                                        </a>
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
}
