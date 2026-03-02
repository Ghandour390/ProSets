import Link from 'next/link';
import { Box, Code2, Layout, Palette } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const categories = [
    {
        name: '3D Models',
        slug: '3d-models',
        icon: Box,
        description: 'Game-ready assets, characters, and environments.',
        color: 'text-blue-500',
        bg: 'bg-blue-500/10',
    },
    {
        name: 'Code Snippets',
        slug: 'code-snippets',
        icon: Code2,
        description: 'Components, utilities, and backend boilerplates.',
        color: 'text-green-500',
        bg: 'bg-green-500/10',
    },
    {
        name: 'Notion Templates',
        slug: 'notion-templates',
        icon: Layout,
        description: 'Productivity systems for work and life.',
        color: 'text-purple-500',
        bg: 'bg-purple-500/10',
    },
    {
        name: 'Design Assets',
        slug: 'design-assets',
        icon: Palette,
        description: 'UI kits, icons, and graphic templates.',
        color: 'text-orange-500',
        bg: 'bg-orange-500/10',
    },
];

export default function FeaturedCategories() {
    return (
        <section className="py-24 bg-muted/30">
            <div className="container mx-auto px-4">
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-black tracking-tight sm:text-4xl text-foreground">
                        Browse by <span className="text-primary italic">Category</span>
                    </h2>
                    <p className="mt-4 text-lg text-muted-foreground">
                        Explore our curated collections of digital masterpieces.
                    </p>
                </div>

                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                    {categories.map((cat) => (
                        <Link key={cat.slug} href={`/assets?category=${cat.slug}`}>
                            <Card className="h-full transition-all hover:scale-[1.02] hover:shadow-lg border-none bg-background">
                                <CardContent className="p-6 flex flex-col items-center text-center">
                                    <div className={`p-4 rounded-2xl mb-4 ${cat.bg}`}>
                                        <cat.icon className={`h-8 w-8 ${cat.color}`} />
                                    </div>
                                    <h3 className="text-xl font-bold mb-2">{cat.name}</h3>
                                    <p className="text-sm text-muted-foreground">
                                        {cat.description}
                                    </p>
                                </CardContent>
                            </Card>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}
