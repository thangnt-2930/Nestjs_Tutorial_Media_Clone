import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { ProfilesService } from './profiles.service';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

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
}
