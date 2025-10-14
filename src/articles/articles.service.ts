import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository, SelectQueryBuilder } from 'typeorm';
import { I18nService } from 'nestjs-i18n';
import { CreateArticleDto } from './dto/create.dto';
import { Article } from './entities/article.entity';
import slugify from 'slugify';
import { DetailArticleResponseDto } from './dto/detail-response.dto';
import { Follow } from '../follows/entities/follows.entity';
import { ListQueryDto } from './dto/list-query.dto';
import { User } from '../users/entities/user.entity';
import { LimitOffsetQueryDto } from './dto/limit-offset-query.dto';

@Injectable()
export class ArticlesService {
  private static readonly DEFAULT_LIMIT = 20;
  private static readonly DEFAULT_OFFSET = 0;
  constructor(
    @InjectRepository(Article)
    private articleRepository: Repository<Article>,
    @InjectRepository(Follow)
    private followRepository: Repository<Follow>,
    private readonly i18n: I18nService,
    @InjectRepository(User)
    private userRepository: Repository<User>,
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

  async getFeed(currentUserId: number, query: LimitOffsetQueryDto) {
    const follows = await this.followRepository.find({
      where: { followerId: currentUserId },
      select: ['followingId'],
    });

    const followingIds = follows.map((f) => f.followingId);
    if (followingIds.length === 0) {
      return { articles: [], articlesCount: 0 };
    }

    const [articles, count] = await this.articleRepository.findAndCount({
      where: { author: { id: In(followingIds) } },
      relations: ['author'],
      order: { createdAt: 'DESC' },
      take: query.limit || ArticlesService.DEFAULT_LIMIT,
      skip: query.offset || ArticlesService.DEFAULT_OFFSET,
    });

    return {
      articles: articles.map(
        (article) => new DetailArticleResponseDto(article, true),
      ),
      articlesCount: count,
    };
  }

  async listArticles(
    query: ListQueryDto,
  ): Promise<{ articles: DetailArticleResponseDto[]; articlesCount: number }> {
    const qb = this.buildBaseQuery(query);

    await this.applyFilters(qb, query);

    const [articles, count] = await qb.getManyAndCount();

    return {
      articles: articles.map(
        (article) => new DetailArticleResponseDto(article),
      ),
      articlesCount: count,
    };
  }

  private buildBaseQuery(query: ListQueryDto): SelectQueryBuilder<Article> {
    return this.articleRepository
      .createQueryBuilder('article')
      .innerJoinAndSelect('article.author', 'author')
      .orderBy('article.createdAt', 'DESC')
      .take(query.limit || ArticlesService.DEFAULT_LIMIT)
      .skip(query.offset || ArticlesService.DEFAULT_OFFSET);
  }

  private async applyFilters(
    qb: SelectQueryBuilder<Article>,
    query: ListQueryDto,
  ): Promise<void> {
    if (query.tag) {
      this.applyTagFilter(qb, query.tag);
    }

    if (query.author) {
      const hasAuthor = await this.applyAuthorFilter(qb, query.author);
      if (!hasAuthor) {
        this.forceEmptyResult(qb);
      }
    }

    if (query.favorited !== undefined) {
      this.applyFavoritedFilter(qb, query.favorited);
    }
  }

  private forceEmptyResult(qb: SelectQueryBuilder<Article>): void {
    qb.andWhere('1 = 0');
  }

  private applyTagFilter(qb: SelectQueryBuilder<Article>, tag: string): void {
    qb.andWhere('article.tagList @> :tagArray', {
      tagArray: JSON.stringify([tag]),
    });
  }

  private async applyAuthorFilter(
    qb: SelectQueryBuilder<Article>,
    authorUsername: string,
  ): Promise<boolean> {
    const author = await this.userRepository.findOne({
      where: { name: authorUsername },
      select: ['id'],
    });

    if (author) {
      qb.andWhere('author.id = :authorId', { authorId: author.id });
      return true;
    }

    return false;
  }

  private applyFavoritedFilter(
    qb: SelectQueryBuilder<Article>,
    favorited: boolean,
  ): void {
    qb.andWhere('article.favorited = :favorited', { favorited });
  }
}
