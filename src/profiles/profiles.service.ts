import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { Follow } from '../follows/entities/follows.entity';
import { FollowProfileDto } from './dto/follow-profile.dto';
import { I18nService } from 'nestjs-i18n';

@Injectable()
export class ProfilesService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    @InjectRepository(Follow)
    private readonly followRepository: Repository<Follow>,
    private readonly i18n: I18nService,
  ) {}

  private async findUserByName(name: string): Promise<User> {
    const user = await this.usersRepository.findOne({ where: { name } });
    if (!user) {
      throw new NotFoundException(await this.i18n.t('error.not_found'));
    }
    return user;
  }

  async getProfile(name: string) {
    const profile = await this.findUserByName(name);
    return { profile: new FollowProfileDto(profile) };
  }

  async followUser(currentUserId: number, name: string) {
    const userToFollow = await this.findUserByName(name);

    if (userToFollow.id === currentUserId) {
      throw new BadRequestException(
        await this.i18n.t('error.not_follow_yourself'),
      );
    }

    const exists = await this.followRepository.findOne({
      where: { followerId: currentUserId, followingId: userToFollow.id },
    });

    if (exists) {
      throw new BadRequestException(
        await this.i18n.t('error.already_following', { args: { name } }),
      );
    }

    const follow = this.followRepository.create({
      followerId: currentUserId,
      followingId: userToFollow.id,
    });

    await this.followRepository.save(follow);

    return { following: true, profile: new FollowProfileDto(userToFollow) };
  }
}
