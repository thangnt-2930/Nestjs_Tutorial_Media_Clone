import { MAX } from 'class-validator';
import { Entity, Column, Unique } from 'typeorm';
import { VALIDATION } from '../user.constant';
import { BaseEntity } from '../../shared/base.entity';

@Entity('users')
@Unique(['email', 'name'])
export class User extends BaseEntity {
  @Column({ length: VALIDATION.NAME.MAX_ENTITY })
  name: string;

  @Column({ length: VALIDATION.EMAIL.MAX_ENTITY })
  email: string;

  @Column({ length: VALIDATION.PASSWORD.MAX_ENTITY })
  password: string;

  @Column({ nullable: true })
  bio: string;

  @Column({ nullable: true })
  image: string;
}
