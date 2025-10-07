import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { I18nService } from 'nestjs-i18n';
import { CreateUserDto } from './dto/create-user.dto';
import { AuthenticatedRequest } from 'src/auth/types/authenticated-request.interface';

describe('UsersController', () => {
  let controller: UsersController;
  let usersService: UsersService;
  let i18nService: I18nService;

  const mockUsersService = {
    create: jest.fn().mockResolvedValue(undefined), // service không return gì, chỉ resolve
  };

  const mockI18nService = {
    t: jest.fn().mockResolvedValue('User created successfully'), // fake i18n message
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        { provide: UsersService, useValue: mockUsersService },
        { provide: I18nService, useValue: mockI18nService },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    usersService = module.get<UsersService>(UsersService);
    i18nService = module.get<I18nService>(I18nService);
  });

  describe('create', () => {
    it('should create user and return i18n message', async () => {
      const dto: CreateUserDto = {
        email: 'testuser@example.com',
        password: 'password123',
        name: 'Test User',
        passwordConfirmation: 'password123',
        bio: '',
        image: '',
      };

      const result = await controller.create(dto);

      expect(usersService.create).toHaveBeenCalledWith(dto);
      expect(i18nService.t).toHaveBeenCalledWith('user.created');
      expect(result).toBe('User created successfully');
    });
  });

  describe('getCurrentUser', () => {
    it('should return current user from request', async () => {
      const mockRequest = {
        user: { sub: 1, email: 'testuser@example.com' },
      } as AuthenticatedRequest;

      const result = await controller.getCurrentUser(mockRequest);
      expect(result).toEqual(mockRequest.user);
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});
