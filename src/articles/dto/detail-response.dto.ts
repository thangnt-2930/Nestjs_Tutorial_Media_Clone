import { ApiProperty } from '@nestjs/swagger';
import { Article } from '../entities/article.entity';
import { DetailProfileResponseDto } from '../../profiles/dto/detail-response.dto';

export class DetailArticleResponseDto {
  @ApiProperty()
  slug: string;

  @ApiProperty()
  title: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  body: string;

  @ApiProperty({ type: [String] })
  tagList: string[];

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  @ApiProperty()
  favorited: boolean;

  @ApiProperty()
  favoritesCount: number;

  @ApiProperty({ type: DetailProfileResponseDto })
  author: DetailProfileResponseDto;

  constructor(article: Article, following: boolean = false) {
    this.slug = article.slug;
    this.title = article.title;
    this.description = article.description;
    this.body = article.body;
    this.tagList = article.tagList;
    this.createdAt = article.createdAt;
    this.updatedAt = article.updatedAt;
    this.favorited = article.favorited;
    this.favoritesCount = article.favoritesCount;
    this.author = new DetailProfileResponseDto(article.author, following);
  }
}
