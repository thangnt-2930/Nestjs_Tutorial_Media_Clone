import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  @ApiProperty({ example: 'testuser@example.com' })
  email: string;

  @IsNotEmpty()
  @MinLength(6)
  @ApiProperty({ example: 'password123' })
  password: string;

  @IsNotEmpty()
  @ApiProperty({ example: 'Test User' })
  name: string;
}
