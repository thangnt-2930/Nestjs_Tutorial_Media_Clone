import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { I18nService } from 'nestjs-i18n';
import { LoginDto } from '../users/dto/login-user.dto';
import { NotFoundException, UnauthorizedException } from '@nestjs/common';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: AuthService;

  const mockAuthService = {
    login: jest.fn(),
  };

  const mockI18nService = {
    t: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
        {
          provide: I18nService,
          useValue: mockI18nService,
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  describe('POST /auth (login)', () => {
    const loginDto: LoginDto = {
      email: 'test@example.com',
      password: 'password123',
    };

    const expectedLoginResponse = {
      access_token: 'jwt-token-here',
    };

    it('should login successfully with valid credentials', async () => {
      // Arrange
      mockAuthService.login.mockResolvedValue(expectedLoginResponse);

      // Act
      const result = await controller.login(loginDto);

      // Assert
      expect(authService.login).toHaveBeenCalledWith(loginDto);
      expect(result).toEqual(expectedLoginResponse);
    });

    it('should throw UnauthorizedException when login fails (unauthorized)', async () => {
      // Arrange
      mockAuthService.login.mockRejectedValue(
        new UnauthorizedException('Unauthorized'),
      );

      // Act & Assert
      await expect(controller.login(loginDto)).rejects.toThrow(
        UnauthorizedException,
      );
      expect(authService.login).toHaveBeenCalledWith(loginDto);
    });

    it('should throw NotFoundException when login fails (user not found)', async () => {
      // Arrange
      mockAuthService.login.mockRejectedValue(
        new NotFoundException('User not found'),
      );

      // Act & Assert
      await expect(controller.login(loginDto)).rejects.toThrow(
        NotFoundException,
      );
      expect(authService.login).toHaveBeenCalledWith(loginDto);
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});
