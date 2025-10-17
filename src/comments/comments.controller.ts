import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create.dto';

@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Post('articles/:slug/comments')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Comment on article' })
  @ApiResponse({ status: 200, description: 'Comment added successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Article not found' })
  async create(
    @Param('slug') slug: string,
    @Body() createCommentDto: CreateCommentDto,
    @CurrentUser('id') currentUserId: number,
  ) {
    return this.commentsService.create(slug, createCommentDto, currentUserId);
  }

  @Get('articles/:slug/comments')
  @ApiOperation({ summary: 'Get comments from article' })
  @ApiResponse({ status: 200, description: 'Comments retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Article not found' })
  async findAll(@Param('slug') slug: string) {
    return this.commentsService.findAll(slug);
  }
}
