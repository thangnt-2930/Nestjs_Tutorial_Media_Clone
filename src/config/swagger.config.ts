import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { INestApplication } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

export function setupSwagger(app: INestApplication) {
  const configService = new ConfigService();
  const config = new DocumentBuilder()
    .setTitle('Media Clone API')
    .setDescription('API documentation for Media Clone')
    .setVersion(configService.get<string>('DEFAULT_API_VERSION') || '1')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);
}
