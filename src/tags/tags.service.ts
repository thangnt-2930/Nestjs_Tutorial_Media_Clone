import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Article } from '../articles/entities/article.entity';

@Injectable()
export class TagsService {
  constructor(
    @InjectRepository(Article)
    private readonly articleRepository: Repository<Article>,
  ) {}

  async findAll(): Promise<string[]> {
    const rawTags = await this.articleRepository
      .createQueryBuilder('article')
      .select('DISTINCT jsonb_array_elements_text(article.tagList)', 'tag')
      .getRawMany();

    return rawTags.map((row) => row.tag);
  }
}
