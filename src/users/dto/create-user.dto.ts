import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  MinLength,
  Validate,
  MaxLength,
} from 'class-validator';
import { UniqueValidator } from '../validators/unique.validator';
import { VALIDATION } from '../user.constant';
import { MatchTargetDecorator } from '../validators/match-target-data.validator';
import { i18nValidationMessage } from 'nestjs-i18n';

export class CreateUserDto {
  @IsEmail(
    {},
    { message: i18nValidationMessage('user.validation.email_invalid') },
  )
  @IsNotEmpty({
    message: i18nValidationMessage('user.validation.email_required'),
  })
  @Validate(UniqueValidator, ['email'], {
    message: i18nValidationMessage('user.validation.email_exists'),
  })
  @MinLength(VALIDATION.EMAIL.MIN, {
    message: i18nValidationMessage('user.validation.email_min'),
  })
  @MaxLength(VALIDATION.EMAIL.MAX, {
    message: i18nValidationMessage('user.validation.email_max'),
  })
  @ApiProperty({ example: 'testuser@example.com' })
  email: string;

  @IsNotEmpty({
    message: i18nValidationMessage('user.validation.password_required'),
  })
  @MinLength(VALIDATION.PASSWORD.MIN, {
    message: i18nValidationMessage('user.validation.password_min'),
  })
  @MaxLength(VALIDATION.PASSWORD.MAX, {
    message: i18nValidationMessage('user.validation.password_max'),
  })
  @ApiProperty({ example: 'password123' })
  password: string;

  @IsNotEmpty({
    message: i18nValidationMessage(
      'user.validation.password_confirmation_required',
    ),
  })
  @MinLength(VALIDATION.PASSWORD.MIN, {
    message: i18nValidationMessage('user.validation.password_confirmation_min'),
  })
  @MaxLength(VALIDATION.PASSWORD.MAX, {
    message: i18nValidationMessage('user.validation.password_confirmation_max'),
  })
  @MatchTargetDecorator('password', {
    message: i18nValidationMessage(
      'user.validation.password_confirmation_mismatch',
    ),
  })
  @ApiProperty({ example: 'password123' })
  passwordConfirmation: string;

  @IsNotEmpty({
    message: i18nValidationMessage('user.validation.name_required'),
  })
  @MinLength(VALIDATION.NAME.MIN, {
    message: i18nValidationMessage('user.validation.name_min'),
  })
  @MaxLength(VALIDATION.NAME.MAX, {
    message: i18nValidationMessage('user.validation.name_max'),
  })
  @Validate(UniqueValidator, ['name'], {
    message: i18nValidationMessage('user.validation.name_exists'),
  })
  @ApiProperty({ example: 'Test User' })
  name: string;

  @ApiProperty({ example: 'Bio 123' })
  @IsNotEmpty({
    message: i18nValidationMessage('user.validation.bio_required'),
  })
  bio: string;

  @ApiProperty({ example: 'image 123' })
  @IsNotEmpty({
    message: i18nValidationMessage('user.validation.image_required'),
  })
  image: string;
}
