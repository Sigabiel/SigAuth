import { UnauthorizedExceptionFilter } from '@/common/filters/unauthorized-exception.filter';
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import cookieParser from 'cookie-parser';
import { AppModule } from './app.module';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    app.setGlobalPrefix('api');
    app.useGlobalPipes(new ValidationPipe());
    app.useGlobalFilters(new UnauthorizedExceptionFilter());
    app.use(cookieParser());

    const config = new DocumentBuilder()
        .setTitle('SigAuth API')
        .setDescription(
            'The SigAuth API is rate limited and protected by 2FA. You cant send more than 10 requests per minute.',
        )
        .setVersion('0.2')
        .build();

    const documentFactory = () => SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, documentFactory);

    await app.listen(process.env.PORT ?? 3000);
}

bootstrap()
    .then(() => console.log('API is running...'))
    .catch(console.error);
