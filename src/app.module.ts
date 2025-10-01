import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSourceOptions } from 'typeorm';
import typeormConfig from './config/database.config';
import { UsersModule } from './users/users.module';
import { i18nConfig } from './config/i18n.config';
import { I18nModule } from 'nestjs-i18n';
import { AuthModule } from './auth/auth.module';
import { ProfilesModule } from './profiles/profiles.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [typeormConfig],
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) =>
        configService.get<DataSourceOptions>('typeorm') as DataSourceOptions,
    }),
    I18nModule.forRoot(i18nConfig),
    UsersModule,
    AuthModule,
    ProfilesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
