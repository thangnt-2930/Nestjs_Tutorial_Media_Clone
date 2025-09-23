import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  MinLength,
  Validate,
  MaxLength,
} from 'class-validator';
import { IsEmailUnique } from '../validators/is-email-unique.validator';
import { VALIDATION } from '../user.constant';
import { MatchTargetDecorator } from '../validators/match-target-data.validator';

export class CreateUserDto {
  @IsEmail()
  @Validate(IsEmailUnique, { message: 'Email already exists' })
  @MinLength(VALIDATION.EMAIL.MIN)
  @MaxLength(VALIDATION.EMAIL.MAX)
  @ApiProperty({ example: 'testuser@example.com' })
  email: string;

  @IsNotEmpty()
  @MinLength(VALIDATION.PASSWORD.MIN)
  @MaxLength(VALIDATION.PASSWORD.MAX)
  @ApiProperty({ example: 'password123' })
  password: string;

  @IsNotEmpty()
  @MinLength(VALIDATION.PASSWORD.MIN)
  @MaxLength(VALIDATION.PASSWORD.MAX)
  @MatchTargetDecorator('password', {
    message: 'Password confirmation does not match password',
  })
  @ApiProperty({ example: 'password123' })
  passwordConfirmation: string;

  @IsNotEmpty()
  @MinLength(VALIDATION.NAME.MIN)
  @MaxLength(VALIDATION.NAME.MAX)
  @ApiProperty({ example: 'Test User' })
  name: string;
}
