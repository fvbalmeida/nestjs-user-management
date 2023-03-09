import { Test } from '@nestjs/testing';
import { UserService } from '../services/user.service';
import { UserEntity } from '../domain/user.entity';
import { UserPermission } from '../domain/user.domain';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('FindById', () => {
  let userService: UserService;
  let userRepository: Repository<UserEntity>;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(UserEntity),
          useClass: Repository,
        },
      ],
    }).compile();

    userService = module.get<UserService>(UserService);
    userRepository = module.get<Repository<UserEntity>>(
      getRepositoryToken(UserEntity),
    );
  });

  it('should return the user profile if the user has permission', async () => {
    const id = 1;
    const user = new UserEntity();
    user.id = id;
    user.name = 'Nextar User';
    user.email = 'nextar@example.com';
    user.phone = '123456789';
    user.permission = UserPermission.STANDARD;

    jest.spyOn(userRepository, 'findOne').mockResolvedValue(user);

    const req = {
      user: {
        id,
        permission: UserPermission.STANDARD,
      },
    };

    const result = await userService.findById(id, req);

    expect(result).toEqual(user);
    expect(userRepository.findOne).toHaveBeenCalledWith({
      where: { id },
      select: ['id', 'name', 'email', 'permission', 'phone'],
    });
  });

  it('should throw a NotFoundException if the user does not exist', async () => {
    const id = 1;

    jest.spyOn(userRepository, 'findOne').mockResolvedValue(undefined);

    const req = {
      user: {
        id: 2,
        permission: UserPermission.ADMIN,
      },
    };

    await expect(userService.findById(id, req)).rejects.toThrowError(
      `User with id ${id} not found`,
    );
    expect(userRepository.findOne).toHaveBeenCalledWith({
      where: { id },
      select: ['id', 'name', 'email', 'permission', 'phone'],
    });
  });
});
