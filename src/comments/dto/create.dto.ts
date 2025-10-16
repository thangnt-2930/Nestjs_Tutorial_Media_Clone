import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';
import { VALIDATION } from '../comments.constant';

export class CreateCommentDto {
  @ApiProperty({ example: 'This article is amazing!' })
  @IsNotEmpty()
  @IsString()
  @MaxLength(VALIDATION.BODY.MAX, {
    message: i18nValidationMessage('comment.validation.body.max', {
      value: VALIDATION.BODY.MAX,
    }),
  })
  @MinLength(VALIDATION.BODY.MIN, {
    message: i18nValidationMessage('comment.validation.body.min', {
      value: VALIDATION.BODY.MIN,
    }),
  })
  body: string;
}
