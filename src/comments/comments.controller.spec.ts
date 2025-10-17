import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { CommentsController } from './comments.controller';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create.dto';
import { ListCommentsResponseDto } from './dto/list-response.dto';

describe('CommentsController', () => {
  let controller: CommentsController;
  let service: CommentsService;

  const mockCommentsService = {
    create: jest.fn(),
    findAll: jest.fn(),
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

  describe('findAll', () => {
    const slug = 'test-article';

    const mockCommentsResponse: ListCommentsResponseDto = {
      comments: [
        {
          id: 1,
          body: 'This is the first comment',
          createdAt: new Date('2025-01-01T10:00:00Z'),
          updatedAt: new Date('2025-01-01T10:00:00Z'),
          author: {
            username: 'user1',
            bio: 'I am a developer',
            image: 'https://example.com/avatar1.jpg',
            following: false,
          },
        },
        {
          id: 2,
          body: 'This is the second comment',
          createdAt: new Date('2025-01-01T11:00:00Z'),
          updatedAt: new Date('2025-01-01T11:00:00Z'),
          author: {
            username: 'user2',
            bio: 'I love coding',
            image: 'https://example.com/avatar2.jpg',
            following: true,
          },
        },
      ],
    };

    it('should get all comments for an article successfully', async () => {
      mockCommentsService.findAll.mockResolvedValue(mockCommentsResponse);

      const result = await controller.findAll(slug);

      expect(result).toEqual(mockCommentsResponse);
      expect(mockCommentsService.findAll).toHaveBeenCalledWith(slug);
      expect(mockCommentsService.findAll).toHaveBeenCalledTimes(1);
    });

    it('should return empty comments array when no comments exist', async () => {
      const emptyResponse: ListCommentsResponseDto = {
        comments: [],
      };

      mockCommentsService.findAll.mockResolvedValue(emptyResponse);

      const result = await controller.findAll(slug);

      expect(result).toEqual(emptyResponse);
      expect(result.comments).toHaveLength(0);
      expect(mockCommentsService.findAll).toHaveBeenCalledWith(slug);
      expect(mockCommentsService.findAll).toHaveBeenCalledTimes(1);
    });

    it('should handle article not found error', async () => {
      const errorMessage = 'Article not found';
      mockCommentsService.findAll.mockRejectedValue(
        new NotFoundException(errorMessage),
      );

      await expect(controller.findAll(slug)).rejects.toThrow(NotFoundException);
      await expect(controller.findAll(slug)).rejects.toThrow(errorMessage);

      expect(mockCommentsService.findAll).toHaveBeenCalledWith(slug);
    });

    it('should handle invalid slug parameter', async () => {
      const invalidSlug = '';
      const errorMessage = 'Invalid slug parameter';
      mockCommentsService.findAll.mockRejectedValue(new Error(errorMessage));

      await expect(controller.findAll(invalidSlug)).rejects.toThrow(
        errorMessage,
      );

      expect(mockCommentsService.findAll).toHaveBeenCalledWith(invalidSlug);
    });

    it('should return comments with correct structure', async () => {
      mockCommentsService.findAll.mockResolvedValue(mockCommentsResponse);

      const result = await controller.findAll(slug);

      expect(result).toHaveProperty('comments');
      expect(Array.isArray(result.comments)).toBe(true);

      if (result.comments.length > 0) {
        const firstComment = result.comments[0];
        expect(firstComment).toHaveProperty('id');
        expect(firstComment).toHaveProperty('body');
        expect(firstComment).toHaveProperty('createdAt');
        expect(firstComment).toHaveProperty('updatedAt');
        expect(firstComment).toHaveProperty('author');
        expect(firstComment.author).toHaveProperty('username');
        expect(firstComment.author).toHaveProperty('bio');
        expect(firstComment.author).toHaveProperty('image');
        expect(firstComment.author).toHaveProperty('following');
      }

      expect(mockCommentsService.findAll).toHaveBeenCalledWith(slug);
    });
  });
});
