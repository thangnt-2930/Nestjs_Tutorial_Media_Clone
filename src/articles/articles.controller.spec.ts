import { Test, TestingModule } from '@nestjs/testing';
import { ArticlesController } from './articles.controller';
import { ArticlesService } from './articles.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ExecutionContext } from '@nestjs/common';

describe('ArticlesController', () => {
  let controller: ArticlesController;
  let service: ArticlesService;

  const mockArticlesService = {
    create: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ArticlesController],
      providers: [{ provide: ArticlesService, useValue: mockArticlesService }],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: (context: ExecutionContext) => true })
      .compile();

    controller = module.get<ArticlesController>(ArticlesController);
    service = module.get<ArticlesService>(ArticlesService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create an article and return success message', async () => {
      const dto = {
        title: 'Test Title',
        description: 'Test Description',
        body: 'Test Body',
        tagList: ['tag1', 'tag2'],
      };
      const userId = 123;
      const successMessage = 'Article created successfully';
      mockArticlesService.create.mockResolvedValue(successMessage);
      const result = await controller.create(dto, userId);
      expect(result).toEqual(successMessage);
      expect(mockArticlesService.create).toHaveBeenCalledWith(dto, userId);
    });

    it('should throw if service throws', async () => {
      const dto = {
        title: 'Test Title',
        description: 'Test Description',
        body: 'Test Body',
        tagList: ['tag1', 'tag2'],
      };
      const userId = 123;
      mockArticlesService.create.mockRejectedValue(new Error('Create failed'));
      await expect(controller.create(dto, userId)).rejects.toThrow(
        'Create failed',
      );
    });
  });
});
