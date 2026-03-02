import Link from 'next/link';
import { ShoppingBag, Github, Twitter, Mail } from 'lucide-react';

export default function Footer() {
    return (
        <footer className="border-t bg-muted/30">
            <div className="container mx-auto px-4 py-12">
                <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
                    <div className="flex flex-col gap-4">
                        <Link href="/" className="flex items-center space-x-2">
                            <ShoppingBag className="h-6 w-6 text-primary" />
                            <span className="text-xl font-bold tracking-tight">ProSets</span>
                        </Link>
                        <p className="text-sm text-muted-foreground max-w-xs">
                            The premium marketplace for professional digital assets. High-quality 3D models, code snippets, and templates.
                        </p>
                    </div>

                    <div>
                        <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider">Marketplace</h3>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li><Link href="/assets" className="hover:text-primary transition-colors">All Assets</Link></li>
                            <li><Link href="/assets?category=3d-models" className="hover:text-primary transition-colors">3D Models</Link></li>
                            <li><Link href="/assets?category=code-snippets" className="hover:text-primary transition-colors">Code Snippets</Link></li>
                            <li><Link href="/assets?category=notion-templates" className="hover:text-primary transition-colors">Notion Templates</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider">Help & Legal</h3>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li><Link href="/about" className="hover:text-primary transition-colors">About Us</Link></li>
                            <li><Link href="/terms" className="hover:text-primary transition-colors">Terms of Service</Link></li>
                            <li><Link href="/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link></li>
                            <li><Link href="/contact" className="hover:text-primary transition-colors">Contact Support</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider">Connect</h3>
                        <div className="flex gap-4">
                            <Link href="#" className="p-2 rounded-full bg-muted hover:bg-muted/80 transition-colors">
                                <Twitter className="h-4 w-4" />
                            </Link>
                            <Link href="#" className="p-2 rounded-full bg-muted hover:bg-muted/80 transition-colors">
                                <Github className="h-4 w-4" />
                            </Link>
                            <Link href="#" className="p-2 rounded-full bg-muted hover:bg-muted/80 transition-colors">
                                <Mail className="h-4 w-4" />
                            </Link>
                        </div>
                    </div>
                </div>

                <div className="mt-12 border-t pt-8 text-center text-sm text-muted-foreground">
                    <p>© {new Date().getFullYear()} ProSets Marketplace. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
}
