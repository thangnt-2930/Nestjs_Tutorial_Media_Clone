import { ApiProperty } from '@nestjs/swagger';
import { User } from 'src/users/entities/user.entity';

export class DetailProfileResponseDto {
  @ApiProperty({ example: 'jake' })
  username: string;

  @ApiProperty({ example: 'I work at statefarm' })
  bio: string | null;

  @ApiProperty({ example: 'https://i.stack.imgur.com/xHWG8.jpg' })
  image: string | null;

  @ApiProperty({ example: false })
  following: boolean;

  constructor(author: User, following: boolean) {
    this.username = author.name;
    this.bio = author.bio;
    this.image = author.image;
    this.following = following;
  }
}
