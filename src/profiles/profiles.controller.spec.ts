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
});
