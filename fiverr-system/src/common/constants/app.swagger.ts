import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export function setupSwagger(app: INestApplication): void {
    const config = new DocumentBuilder()
        .setTitle('Fiverr Market System API')
        .setDescription('Danh sách API cho Fiverr Market System')
        .setVersion('1.0')
        .addBearerAuth(
            {
                type: 'http',
                scheme: 'bearer',
                bearerFormat: 'JWT'
            },
            'access-token'
        )
        .addApiKey(
            {
                type: 'apiKey',
                name: 'TokenCybersoft',
                in: 'header',
            },
            'cybersoft-token'
        )
        .build();

    const document = SwaggerModule.createDocument(app, config);
    document.security = [{ 'access-token': [], 'cybersoft-token': [] }];
    SwaggerModule.setup('api/docs', app, document);
}
