import {
  Entity,
  Column,
  Unique,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { BaseEntity } from '../../shared/base.entity';
import { User } from '../../users/entities/user.entity';
import { VALIDATION } from '../articles.constant';
import { Comment } from '../../comments/entities/comment.entity';

@Entity('articles')
@Unique(['slug'])
export class Article extends BaseEntity {
  @Column()
  slug: string;

  @Column({ length: VALIDATION.TITLE.MAX_ENTITY })
  title: string;

  @Column({ length: VALIDATION.DESCRIPTION.MAX_ENTITY })
  description: string;

  @Column({ length: VALIDATION.BODY.MAX_ENTITY })
  body: string;

  @Column({ name: 'tag_list', type: 'jsonb' })
  tagList: string[];

  @Column({ default: false })
  favorited: boolean;

  @Column({ name: 'author_id' })
  authorId: number;

  @Column({ name: 'favorites_count', default: 0 })
  favoritesCount: number;

  @ManyToOne(() => User, (user) => user.articles, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'author_id' })
  author: User;

  @OneToMany(() => Comment, (comment) => comment.article)
  comments: Comment[];
}
