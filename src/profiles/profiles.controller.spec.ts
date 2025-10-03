import { Test, TestingModule } from '@nestjs/testing';
import { ProfilesController } from './profiles.controller';
import { ProfilesService } from './profiles.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ExecutionContext } from '@nestjs/common';

describe('ProfilesController', () => {
  let controller: ProfilesController;
  let service: ProfilesService;

  const mockProfilesService = {
    getProfile: jest.fn(),
    followUser: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProfilesController],
      providers: [{ provide: ProfilesService, useValue: mockProfilesService }],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: (context: ExecutionContext) => true })
      .compile();

    controller = module.get<ProfilesController>(ProfilesController);
    service = module.get<ProfilesService>(ProfilesService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getProfile', () => {
    it('should return profile data', async () => {
      const profile = { name: 'test', bio: 'bio', image: 'img' };
      mockProfilesService.getProfile.mockResolvedValue({ profile });
      const result = await controller.getProfile('test');
      expect(result).toEqual({ profile });
      expect(mockProfilesService.getProfile).toHaveBeenCalledWith('test');
    });

    it('should throw if service throws', async () => {
      mockProfilesService.getProfile.mockRejectedValue(new Error('Not found'));
      await expect(controller.getProfile('notfound')).rejects.toThrow(
        'Not found',
      );
    });
  });

  describe('followUser', () => {
    const userId = 1;
    it('should follow user and return following info', async () => {
      const name = 'targetUser';
      const followResult = {
        following: true,
        profile: { name: 'targetUser', bio: 'bio', image: 'img' },
      };
      mockProfilesService.followUser.mockResolvedValue(followResult);

      const result = await controller.followUser(name, userId);

      expect(result).toEqual(followResult);
      expect(mockProfilesService.followUser).toHaveBeenCalledWith(userId, name);
    });

    it('should throw if service throws (user not found)', async () => {
      mockProfilesService.followUser.mockRejectedValue(
        new Error('User not found'),
      );

      await expect(controller.followUser('notfound', userId)).rejects.toThrow(
        'User not found',
      );
    });

    it('should throw if service throws (bad request)', async () => {
      mockProfilesService.followUser.mockRejectedValue(
        new Error('You cannot follow yourself'),
      );

      await expect(controller.followUser('targetUser', userId)).rejects.toThrow(
        'You cannot follow yourself',
      );
    });
  });
});
