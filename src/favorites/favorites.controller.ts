import { Controller, Delete, Param, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { FavoritesService } from './favorites.service';

@Controller('favorites')
export class FavoritesController {
  constructor(private readonly favoritesService: FavoritesService) {}

  @Post(':slug/favorite')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Favorite an article' })
  @ApiResponse({ status: 201, description: 'Article favorited successfully' })
  @ApiResponse({ status: 400, description: 'Article is already favorited' })
  @ApiResponse({ status: 404, description: 'Article not found' })
  async favorite(
    @Param('slug') slug: string,
    @CurrentUser('id') currentUserId: number,
  ) {
    return this.favoritesService.favoriteArticle(slug, currentUserId);
  }

  @Delete(':slug/unfavorite')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Unfavorite an article' })
  @ApiResponse({ status: 200, description: 'Article unfavorited successfully' })
  @ApiResponse({ status: 400, description: 'Article is not favorited yet' })
  @ApiResponse({ status: 404, description: 'Article not found' })
  async unfavorite(
    @Param('slug') slug: string,
    @CurrentUser('id') currentUserId: number,
  ) {
    return this.favoritesService.unfavoriteArticle(slug, currentUserId);
  }
}
