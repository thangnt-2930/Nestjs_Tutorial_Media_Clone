import { User } from 'src/users/entities/user.entity';

export class FollowProfileDto {
  name: string;
  bio: string;
  image: string;

  constructor(user: User) {
    this.name = user.name;
    this.bio = user.bio;
    this.image = user.image;
  }
}
