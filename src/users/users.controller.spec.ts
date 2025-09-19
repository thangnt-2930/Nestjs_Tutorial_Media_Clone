import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

describe('UsersController', () => {
  let controller: UsersController;

  const mockUserRepository = {
    create: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        UsersService,
        { provide: 'UserRepository', useValue: mockUserRepository },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('created user successfully', () => {
    expect(
      controller.create({
        email: 'testuser@example.com',
        password: 'password123',
        name: 'Test User',
      }),
    ).toEqual('User created successfully');
  });
});
