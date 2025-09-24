import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { VersioningType } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { setupSwagger } from './config/swagger.config';
import { useContainer } from 'class-validator';
import { I18nValidationPipe, I18nValidationExceptionFilter } from 'nestjs-i18n';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  // Versioning
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: configService.get<string>('DEFAULT_API_VERSION') || '1',
  });

  useContainer(app.select(AppModule), { fallbackOnErrors: true });

  // Configure I18n Validation
  app.useGlobalPipes(
    new I18nValidationPipe({
      transform: true,
      whitelist: true,
      stopAtFirstError: true,
    }),
  );

  // Return message neatly
  app.useGlobalFilters(
    new I18nValidationExceptionFilter({
      detailedErrors: false,
    }),
  );

  // Swagger
  setupSwagger(app);

  // Start the server
  await app.listen(configService.get<string>('PORT') || 3000);
}
bootstrap();
