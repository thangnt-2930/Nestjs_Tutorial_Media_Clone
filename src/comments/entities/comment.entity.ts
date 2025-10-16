import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from '../../shared/base.entity';
import { User } from '../../users/entities/user.entity';
import { Article } from '../../articles/entities/article.entity';
import { VALIDATION } from '../comments.constant';

@Entity('comments')
export class Comment extends BaseEntity {
  @Column({ length: VALIDATION.BODY.MAX })
  body: string;

  @ManyToOne(() => User, (user) => user.comments, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'author_id' })
  author: User;

  @Column({ name: 'author_id' })
  authorId: number;

  @ManyToOne(() => Article, (article) => article.comments, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'article_id' })
  article: Article;

  @Column({ name: 'article_id' })
  articleId: number;
}
