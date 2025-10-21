import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Article } from '../articles/entities/article.entity';
import { Repository } from 'typeorm';
import { Favorite } from './entities/favorite.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { I18nService } from 'nestjs-i18n';
import { ArticlesService } from '../articles/articles.service';

@Injectable()
export class FavoritesService {
  constructor(
    @InjectRepository(Favorite)
    private favoriteRepository: Repository<Favorite>,
    @InjectRepository(Article)
    private articleRepository: Repository<Article>,
    private readonly i18n: I18nService,
    private readonly articleService: ArticlesService,
  ) {}

  async favoriteArticle(slug: string, currentUserId: number) {
    const article = await this.articleService.loadArticle(slug);

    const existing = await this.favoriteRepository.findOne({
      where: { articleId: article.id, userId: currentUserId },
    });

    if (existing) {
      throw new BadRequestException(this.i18n.t('favorite.already_favorited'));
    }

    const favorite = this.favoriteRepository.create({
      articleId: article.id,
      userId: currentUserId,
    });
    await this.favoriteRepository.save(favorite);
    await this.articleRepository.increment(
      { id: article.id },
      'favoritesCount',
      1,
    );

    return this.i18n.t('favorite.favorited');
  }

  async unfavoriteArticle(slug: string, currentUserId: number) {
    const article = await this.articleService.loadArticle(slug);

    const favorite = await this.favoriteRepository.findOne({
      where: { articleId: article.id, userId: currentUserId },
    });

    if (!favorite) {
      throw new BadRequestException(this.i18n.t('favorite.not_favorited'));
    }

    await this.favoriteRepository.remove(favorite);
    await this.articleRepository.decrement(
      { id: article.id },
      'favoritesCount',
      1,
    );

    return this.i18n.t('favorite.unfavorited');
  }
}
