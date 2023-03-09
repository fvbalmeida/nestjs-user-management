import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserDomain, UserPermission } from '../domain/user.domain';
import { UserEntity } from '../domain/user.entity';
import { UserService } from '../services/user.service';

describe('FindByEmail', () => {
  let userService: UserService;
  let userRepository: Repository<UserEntity>;

  const mockUser: UserDomain = {
    name: 'Nextar User',
    email: 'nextar@example.com',
    password: 'password123',
    permission: UserPermission.STANDARD,
    phone: '1234567890',
  };

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(UserEntity),
          useClass: Repository,
        },
      ],
    }).compile();

    userService = moduleRef.get<UserService>(UserService);
    userRepository = moduleRef.get<Repository<UserEntity>>(
      getRepositoryToken(UserEntity),
    );
  });

  it('should return error when user is not found', async () => {
    const email = 'undefinednextar@example.com';
    jest.spyOn(userRepository, 'findOne').mockResolvedValueOnce(null);

    await expect(userService.findByEmail(email)).rejects.toThrow(
      'User not found',
    );
    expect(userRepository.findOne).toHaveBeenCalledWith({ where: { email } });
  });

  it('should return the user when user is found', async () => {
    const email = mockUser.email;
    jest
      .spyOn(userRepository, 'findOne')
      .mockResolvedValueOnce(mockUser as UserEntity);

    const result = await userService.findByEmail(email);

    expect(result).toEqual(mockUser);
    expect(userRepository.findOne).toHaveBeenCalledWith({ where: { email } });
  });
});
