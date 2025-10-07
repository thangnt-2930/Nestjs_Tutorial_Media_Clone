import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, MaxLength, Min, MinLength } from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';
import { VALIDATION } from '../articles.constant';

export class CreateArticleDto {
  @IsNotEmpty({
    message: i18nValidationMessage('article.validation.title_required'),
  })
  @MinLength(VALIDATION.TITLE.MIN, {
    message: i18nValidationMessage('article.validation.title_min', {
      value: VALIDATION.TITLE.MIN,
    }),
  })
  @MaxLength(VALIDATION.TITLE.MAX, {
    message: i18nValidationMessage('article.validation.title_max', {
      value: VALIDATION.TITLE.MAX,
    }),
  })
  @ApiProperty({ example: 'Article Title' })
  title: string;

  @IsNotEmpty({
    message: i18nValidationMessage('article.validation.description_required'),
  })
  @MaxLength(VALIDATION.DESCRIPTION.MAX, {
    message: i18nValidationMessage('article.validation.description_max', {
      value: VALIDATION.DESCRIPTION.MAX,
    }),
  })
  @MinLength(VALIDATION.DESCRIPTION.MIN, {
    message: i18nValidationMessage('article.validation.description_min', {
      value: VALIDATION.DESCRIPTION.MIN,
    }),
  })
  @ApiProperty({ example: 'Article Description' })
  description: string;

  @IsNotEmpty({
    message: i18nValidationMessage('article.validation.body_required'),
  })
  @MinLength(VALIDATION.BODY.MIN, {
    message: i18nValidationMessage('article.validation.body_min', {
      value: VALIDATION.BODY.MIN,
    }),
  })
  @MaxLength(VALIDATION.BODY.MAX, {
    message: i18nValidationMessage('article.validation.body_max', {
      value: VALIDATION.BODY.MAX,
    }),
  })
  @ApiProperty({ example: 'Article Body' })
  body: string;

  @IsNotEmpty({
    message: i18nValidationMessage('article.validation.tagList_required'),
  })
  @ApiProperty({ example: ['tag1', 'tag2'] })
  tagList: string[];
}
