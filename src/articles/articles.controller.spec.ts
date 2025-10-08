import { Test, TestingModule } from '@nestjs/testing';
import { ArticlesController } from './articles.controller';
import { ArticlesService } from './articles.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ExecutionContext, NotFoundException } from '@nestjs/common';

describe('ArticlesController', () => {
  let controller: ArticlesController;
  let service: ArticlesService;

  const mockArticlesService = {
    create: jest.fn(),
    getArticleBySlug: jest.fn(),
  };

  const mockFollowRepository = {
    exists: jest.fn(),
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

  describe('getArticle', () => {
    const slug = 'test-article';
    const userId = 1;
    const mockDate = new Date('2023-01-01T00:00:00.000Z');

    const buildArticleResponse = (following: boolean) => ({
      article: {
        slug: 'test-article',
        title: 'Test Article',
        description: 'Test Description',
        body: 'Test Body',
        tagList: ['tag1', 'tag2'],
        createdAt: mockDate,
        updatedAt: mockDate,
        favorited: false,
        favoritesCount: 0,
        author: {
          username: 'testuser',
          bio: 'Test bio',
          image: 'test-image.jpg',
          following: following,
        },
      },
    });

    it('should return article with following=true when current user follows the author', async () => {
      const article = buildArticleResponse(true);
      mockArticlesService.getArticleBySlug.mockResolvedValue(article);

      const result = await controller.getArticle(slug, userId);

      expect(mockArticlesService.getArticleBySlug).toHaveBeenCalledWith(
        slug,
        userId,
      );
      expect(result).toEqual(article);
      expect(result.article.author.following).toBe(true);
    });

    it('should return article with following=false when current user does not follow the author', async () => {
      const article = buildArticleResponse(false);
      mockArticlesService.getArticleBySlug.mockResolvedValue(article);

      const result = await controller.getArticle(slug, userId);

      expect(mockArticlesService.getArticleBySlug).toHaveBeenCalledWith(
        slug,
        userId,
      );
      expect(result).toEqual(article);
      expect(result.article.author.following).toBe(false);
    });

    it('should throw NotFoundException when article not found', async () => {
      const notFoundError = new NotFoundException('Article not found');
      mockArticlesService.getArticleBySlug.mockRejectedValue(notFoundError);

      await expect(controller.getArticle(slug, userId)).rejects.toThrow(
        NotFoundException,
      );
      expect(mockArticlesService.getArticleBySlug).toHaveBeenCalledWith(
        slug,
        userId,
      );
    });
  });
});
