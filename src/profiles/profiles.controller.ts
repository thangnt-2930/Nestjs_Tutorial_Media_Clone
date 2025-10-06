import {
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ProfilesService } from './profiles.service';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@Controller('profiles')
export class ProfilesController {
  constructor(private readonly profilesService: ProfilesService) {}

  @Get(':name')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Profiles' })
  @ApiResponse({ status: 200, description: 'Get profile successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getProfile(@Param('name') name: string) {
    return this.profilesService.getProfile(name);
  }

  @Post(':name/follow')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Follow a user profile' })
  @ApiResponse({ status: 200, description: 'Follow successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Not Found' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  async followUser(
    @Param('name') name: string,
    @CurrentUser('id') userId: number,
  ) {
    return this.profilesService.followUser(userId, name);
  }

  @Delete(':name/unfollow')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Unfollow a user profile' })
  @ApiResponse({ status: 200, description: 'Unfollow successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Not Found' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  async unfollowUser(
    @Param('name') name: string,
    @CurrentUser('id') userId: number,
  ) {
    return this.profilesService.unfollowUser(userId, name);
  }
}
