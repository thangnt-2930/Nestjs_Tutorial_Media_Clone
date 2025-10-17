import { ApiProperty } from '@nestjs/swagger';
import { DetailProfileResponseDto } from '../../profiles/dto/detail-response.dto';
import { Comment } from '../entities/comment.entity';

export class CommentResponseDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  @ApiProperty()
  body: string;

  @ApiProperty({ type: DetailProfileResponseDto })
  author: DetailProfileResponseDto;

  constructor(comment: Comment, following: boolean = false) {
    this.id = comment.id;
    this.body = comment.body;
    this.createdAt = comment.createdAt;
    this.updatedAt = comment.updatedAt;
    this.author = new DetailProfileResponseDto(comment.author, following);
  }
}

export class ListCommentsResponseDto {
  @ApiProperty({ type: [CommentResponseDto] })
  comments: CommentResponseDto[];

  constructor(comments: Comment[]) {
    this.comments = comments.map((comment) => new CommentResponseDto(comment));
  }
}
