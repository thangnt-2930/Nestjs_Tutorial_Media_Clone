import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { I18nService } from 'nestjs-i18n';
import { Article } from '../articles/entities/article.entity';
import { User } from '../users/entities/user.entity';
import { Comment } from './entities/comment.entity';
import { CreateCommentDto } from './dto/create.dto';
import { ArticlesService } from '../articles/articles.service';
import { ListCommentsResponseDto } from './dto/list-response.dto';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>,
    @InjectRepository(Article)
    private readonly articleRepository: Repository<Article>,
    private readonly i18n: I18nService,
    private readonly articleService: ArticlesService,
  ) {}

  async create(
    slug: string,
    dto: CreateCommentDto,
    currentUserId: number,
  ): Promise<Comment> {
    const article = await this.articleService.loadArticle(slug);

    const comment = this.commentRepository.create({
      body: dto.body,
      article,
      author: { id: currentUserId } as User,
    });

    await this.commentRepository.save(comment);
    return this.i18n.t('comment.created');
  }

  async findAll(slug: string): Promise<ListCommentsResponseDto> {
    const article = await this.articleService.loadArticle(slug);

    const comments = await this.commentRepository.find({
      where: { article: { id: article.id } },
      relations: ['author'],
      order: { createdAt: 'DESC' },
    });

    return new ListCommentsResponseDto(comments);
  }
}
