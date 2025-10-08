import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ArticlesController } from './articles.controller';
import { ArticlesService } from './articles.service';
import { Article } from './entities/article.entity';
import { Follow } from '../follows/entities/follows.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Article, Follow])],
  controllers: [ArticlesController],
  providers: [ArticlesService],
})
export class ArticlesModule {}
