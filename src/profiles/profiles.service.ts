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

  async getProfile(name: string) {
    const profile = await this.findUserByName(name);
    return { profile: new FollowProfileDto(profile) };
  }

  async followUser(currentUserId: number, name: string) {
    const userToFollow = await this.findUserByName(name);
    await this.ensureNotSelfAction(
      currentUserId,
      userToFollow,
      'error.not_follow_yourself',
    );

    const exists = await this.findFollow(currentUserId, userToFollow.id);
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

  async unfollowUser(currentUserId: number, name: string) {
    const userToUnfollow = await this.findUserByName(name);
    await this.ensureNotSelfAction(
      currentUserId,
      userToUnfollow,
      'error.not_unfollow_yourself',
    );

    const follow = await this.findFollow(currentUserId, userToUnfollow.id);
    if (!follow) {
      throw new BadRequestException(
        await this.i18n.t('error.not_following', { args: { name } }),
      );
    }

    await this.followRepository.remove(follow);
    return { following: false, profile: new FollowProfileDto(userToUnfollow) };
  }

  private async findUserByName(name: string): Promise<User> {
    const user = await this.usersRepository.findOne({ where: { name } });
    if (!user) {
      throw new NotFoundException(await this.i18n.t('error.not_found'));
    }
    return user;
  }

  private async ensureNotSelfAction(
    currentUserId: number,
    targetUser: User,
    errorKey: string,
  ) {
    if (targetUser.id === currentUserId) {
      throw new BadRequestException(await this.i18n.t(errorKey));
    }
  }

  private async findFollow(
    followerId: number,
    followingId: number,
  ): Promise<Follow | null> {
    return this.followRepository.findOne({
      where: { followerId, followingId },
    });
  }
}
