import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
    const app = await NestFactory.create(AppModule, {
        rawBody: true, // Needed for Stripe webhook signature verification
    });

    app.useGlobalPipes(
        new ValidationPipe({
            whitelist: true,
            transform: true,
            transformOptions: { enableImplicitConversion: true },
        }),
    );

    app.enableCors({
        origin: ['http://localhost:5500'],
        credentials: true,
    });

    // Swagger API docs
    const config = new DocumentBuilder()
        .setTitle('ProSets API')
        .setDescription('Digital Assets Marketplace API')
        .setVersion('1.0')
        .addBearerAuth()
        .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, document);

    await app.listen(3000);
    console.log('🚀 Server running on http://localhost:3000');
    console.log('📚 Swagger docs at http://localhost:3000/api');
}
bootstrap();
