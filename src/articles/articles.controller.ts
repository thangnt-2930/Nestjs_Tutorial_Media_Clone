import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ArticlesService } from './articles.service';
import { CreateArticleDto } from './dto/create.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { DetailArticleResponseDto } from './dto/detail-response.dto';
import { LimitOffsetQueryDto } from './dto/limit-offset-query.dto';
import { ListQueryDto } from './dto/list-query.dto';

@Controller('articles')
export class ArticlesController {
  constructor(private readonly articlesService: ArticlesService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create article' })
  @ApiResponse({ status: 201, description: 'Article created successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async create(
    @Body() createArticleDto: CreateArticleDto,
    @CurrentUser('id') userId: number,
  ) {
    return await this.articlesService.create(createArticleDto, userId);
  }

  @Get('feed')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get articles feed' })
  @ApiResponse({ status: 200, description: 'Feed retrieved successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getFeed(
    @CurrentUser('id') currentUserId: number,
    @Query() query: LimitOffsetQueryDto,
  ): Promise<{ articles: DetailArticleResponseDto[]; articlesCount: number }> {
    return this.articlesService.getFeed(currentUserId, query);
  }

  @Get()
  @ApiOperation({ summary: 'List articles' })
  @ApiResponse({ status: 200, description: 'Articles retrieved successfully' })
  async listArticles(
    @Query() query: ListQueryDto,
  ): Promise<{ articles: DetailArticleResponseDto[]; articlesCount: number }> {
    return this.articlesService.listArticles(query);
  }

  @Get(':slug')
  @ApiOperation({ summary: 'Get single article by slug' })
  @ApiResponse({ status: 200, description: 'Article retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Article not found' })
  async getArticle(
    @Param('slug') slug: string,
    @CurrentUser('id') userId: number,
  ) {
    return await this.articlesService.getArticleBySlug(slug, userId);
  }

  @Delete(':slug')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete article by slug' })
  @ApiResponse({ status: 200, description: 'Article deleted successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Article not found' })
  async deleteArticle(
    @Param('slug') slug: string,
    @CurrentUser('id') currentUserId: number,
  ) {
    return this.articlesService.deleteArticleBySlug(slug, currentUserId);
  }
}
