import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { BaseEntity } from '../../shared/base.entity';

@Entity('follows')
export class Follow extends BaseEntity {
  @Column({ name: 'follower_id', type: 'bigint' })
  followerId: number;

  @Column({ name: 'following_id', type: 'bigint' })
  followingId: number;

  @ManyToOne(() => User, (user) => user.following, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'following_id' })
  following: User;

  @ManyToOne(() => User, (user) => user.followers, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'follower_id' })
  follower: User;
}
