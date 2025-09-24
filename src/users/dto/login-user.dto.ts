import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString } from 'class-validator';

export class LoginDto {
  @ApiProperty({ example: 'testuser@example.com' })
  @IsEmail()
  email: string;

  @IsString()
  @ApiProperty({ example: 'password123' })
  password: string;
}
