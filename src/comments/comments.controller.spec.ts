import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { CommentsController } from './comments.controller';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create.dto';

describe('CommentsController', () => {
  let controller: CommentsController;
  let service: CommentsService;

  const mockCommentsService = {
    create: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CommentsController],
      providers: [
        {
          provide: CommentsService,
          useValue: mockCommentsService,
        },
      ],
    }).compile();

    controller = module.get<CommentsController>(CommentsController);
    service = module.get<CommentsService>(CommentsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    const slug = 'test-article';
    const userId = 1;
    const createCommentDto: CreateCommentDto = {
      body: 'This is a test comment',
    };

    it('should create a comment successfully', async () => {
      const expectedResponse = 'Comment created successfully';
      mockCommentsService.create.mockResolvedValue(expectedResponse);

      const result = await controller.create(slug, createCommentDto, userId);

      expect(result).toBe(expectedResponse);
      expect(mockCommentsService.create).toHaveBeenCalledWith(
        slug,
        createCommentDto,
        userId,
      );
      expect(mockCommentsService.create).toHaveBeenCalledTimes(1);
    });

    it('should handle article not found', async () => {
      const errorMessage = 'Article not found';
      mockCommentsService.create.mockRejectedValue(
        new NotFoundException(errorMessage),
      );

      await expect(
        controller.create(slug, createCommentDto, userId),
      ).rejects.toThrow(NotFoundException);
      await expect(
        controller.create(slug, createCommentDto, userId),
      ).rejects.toThrow(errorMessage);

      expect(mockCommentsService.create).toHaveBeenCalledWith(
        slug,
        createCommentDto,
        userId,
      );
    });

    it('should handle comment body less than minimum length', async () => {
      const invalidDto: CreateCommentDto = {
        body: 'Short',
      };

      const validationError = new Error(
        'Comment body must be at least 10 characters long',
      );
      mockCommentsService.create.mockRejectedValue(validationError);

      await expect(controller.create(slug, invalidDto, userId)).rejects.toThrow(
        'Comment body must be at least 10 characters long',
      );

      expect(mockCommentsService.create).toHaveBeenCalledWith(
        slug,
        invalidDto,
        userId,
      );
    });

    it('should handle long comment body', async () => {
      const longCommentDto: CreateCommentDto = {
        body: 'A'.repeat(1000),
      };

      mockCommentsService.create.mockResolvedValue(
        'Comment created successfully',
      );

      const result = await controller.create(slug, longCommentDto, userId);

      expect(result).toBe('Comment created successfully');
      expect(mockCommentsService.create).toHaveBeenCalledWith(
        slug,
        longCommentDto,
        userId,
      );
    });
  });
});
