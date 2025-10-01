import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';

@Injectable()
export class ProfilesService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  async getProfile(name: string) {
    const profile = await this.usersRepository.findOne({
      where: { name },
      select: ['name', 'bio', 'image'],
    });

    if (!profile) {
      throw new NotFoundException(`Profile with name "${name}" not found`);
    }

    return { profile };
  }
}
