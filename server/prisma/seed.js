const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Seeding database...');

    // Create categories
    const categories = await Promise.all([
        prisma.category.upsert({
            where: { slug: '3d-models' },
            update: {},
            create: { name: '3D Models', slug: '3d-models' },
        }),
        prisma.category.upsert({
            where: { slug: 'code-snippets' },
            update: {},
            create: { name: 'Code Snippets', slug: 'code-snippets' },
        }),
        prisma.category.upsert({
            where: { slug: 'notion-templates' },
            update: {},
            create: { name: 'Notion Templates', slug: 'notion-templates' },
        }),
        prisma.category.upsert({
            where: { slug: 'design-assets' },
            update: {},
            create: { name: 'Design Assets', slug: 'design-assets' },
        }),
    ]);

    console.log(`✅ Created ${categories.length} categories`);

    // Create a demo seller
    const seller = await prisma.user.upsert({
        where: { auth0Id: 'demo-seller' },
        update: {},
        create: {
            auth0Id: 'demo-seller',
            email: 'seller@prosets.demo',
            role: 'SELLER',
        },
    });

    console.log(`✅ Created demo seller: ${seller.email}`);

    // Create a demo admin
    const admin = await prisma.user.upsert({
        where: { auth0Id: 'demo-admin' },
        update: {},
        create: {
            auth0Id: 'demo-admin',
            email: 'admin@prosets.demo',
            role: 'ADMIN',
        },
    });

    console.log(`✅ Created demo admin: ${admin.email}`);

    // Create demo assets
    const assets = [
        {
            title: 'Low Poly Character Pack',
            description: 'A collection of 10 low-poly character models ready for game development. Includes rigged animations and PBR textures.',
            price: 29.99,
            fileKey: 'assets/demo/low-poly-pack.zip',
            previewUrl: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800',
            sellerId: seller.id,
            categoryId: categories[0].id,
            status: 'ACTIVE',
        },
        {
            title: 'React Auth Starter Kit',
            description: 'Complete authentication boilerplate with JWT, OAuth2, role-based access control, and password reset flow.',
            price: 19.99,
            fileKey: 'assets/demo/react-auth-kit.zip',
            previewUrl: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800',
            sellerId: seller.id,
            categoryId: categories[1].id,
            status: 'ACTIVE',
        },
        {
            title: 'Notion Project Tracker',
            description: 'Professional project management template with Kanban boards, Gantt charts, and team dashboards.',
            price: 14.99,
            fileKey: 'assets/demo/notion-tracker.zip',
            previewUrl: 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=800',
            sellerId: seller.id,
            categoryId: categories[2].id,
            status: 'ACTIVE',
        },
        {
            title: 'Glassmorphism UI Kit',
            description: '50+ glassmorphism components in Figma with dark and light variants. Includes icons and typography system.',
            price: 39.99,
            fileKey: 'assets/demo/glass-ui-kit.zip',
            previewUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800',
            sellerId: seller.id,
            categoryId: categories[3].id,
            status: 'ACTIVE',
        },
        {
            title: 'Sci-Fi Environment Pack',
            description: 'Modular sci-fi environment kit with 30+ pieces. PBR materials, optimized for real-time rendering.',
            price: 49.99,
            fileKey: 'assets/demo/scifi-env.zip',
            previewUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800',
            sellerId: seller.id,
            categoryId: categories[0].id,
            status: 'ACTIVE',
        },
        {
            title: 'Node.js API Boilerplate',
            description: 'Production-ready Node.js REST API with TypeScript, Prisma, rate limiting, caching, and Docker setup.',
            price: 24.99,
            fileKey: 'assets/demo/node-boilerplate.zip',
            previewUrl: 'https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=800',
            sellerId: seller.id,
            categoryId: categories[1].id,
            status: 'ACTIVE',
        },
    ];

    for (const asset of assets) {
        await prisma.asset.upsert({
            where: { id: asset.fileKey }, // Won't match, forces create
            update: {},
            create: asset,
        });
    }

    console.log(`✅ Created ${assets.length} demo assets`);
    console.log('🎉 Seeding complete!');
}

main()
    .catch((e) => {
        console.error('❌ Seeding failed:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
