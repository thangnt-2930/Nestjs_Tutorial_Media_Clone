import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { I18nService } from 'nestjs-i18n';
import { CreateArticleDto } from './dto/create.dto';
import { Article } from './entities/article.entity';
import slugify from 'slugify';
import { DetailArticleResponseDto } from './dto/detail-response.dto';
import { Follow } from '../follows/entities/follows.entity';

@Injectable()
export class ArticlesService {
  constructor(
    @InjectRepository(Article)
    private articleRepository: Repository<Article>,
    @InjectRepository(Follow)
    private followRepository: Repository<Follow>,
    private readonly i18n: I18nService,
  ) {}

  async create(createArticleDto: CreateArticleDto, authorId: number) {
    let slug = slugify(createArticleDto.title, { lower: true, strict: true });

    const existing = await this.articleRepository.findOne({ where: { slug } });
    if (existing) {
      const randomSuffix = Math.floor(Math.random() * 10000);
      slug = `${slug}-${randomSuffix}`;
    }

    const article = this.articleRepository.create({
      ...createArticleDto,
      slug: slug,
      authorId: authorId,
    });

    await this.articleRepository.save(article);
    return this.i18n.t('article.created');
  }

  async getArticleBySlug(slug: string, currentUserId: number) {
    const article = await this.articleRepository.findOne({
      where: { slug },
      relations: ['author'],
    });

    if (!article) {
      throw new NotFoundException(this.i18n.t('error.not_found'));
    }

    const following = await this.followRepository.exists({
      where: { followerId: currentUserId, followingId: article.author.id },
    });

    return { article: new DetailArticleResponseDto(article, following) };
  }
}
