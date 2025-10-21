import { Controller, Get } from '@nestjs/common';
import { TagsService } from './tags.service';
import { ApiResponse } from '@nestjs/swagger';

@Controller('tags')
export class TagsController {
  constructor(private readonly tagsService: TagsService) {}

  @Get()
  @ApiResponse({
    status: 200,
    description: 'List of tags retrieved successfully',
  })
  async findAll(): Promise<string[]> {
    return this.tagsService.findAll();
  }
}
