import { Test } from '@nestjs/testing';
import { UserService } from '../services/user.service';
import { UserEntity } from '../domain/user.entity';
import { UserPermission } from '../domain/user.domain';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('RemoveUser', () => {
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

  it('should remove the user if the user has permission', async () => {
    const id = 1;
    const user = new UserEntity();
    user.id = id;
    user.name = 'Nextar User';
    user.email = 'nextar@example.com';
    user.phone = '123456789';
    user.permission = UserPermission.STANDARD;

    jest.spyOn(userRepository, 'findOne').mockResolvedValue(user);
    jest.spyOn(userRepository, 'remove').mockResolvedValue(undefined);

    const req = {
      user: {
        id: 2,
        permission: UserPermission.ADMIN,
      },
    };

    await userService.remove(id, req);

    expect(userRepository.findOne).toHaveBeenCalledWith({ where: { id } });
    expect(userRepository.remove).toHaveBeenCalledWith(user);
  });

  it('should throw a NotFoundException if the user does not exist', async () => {
    const id = 1;

    jest.spyOn(userRepository, 'findOne').mockResolvedValue(undefined);
    jest.spyOn(userRepository, 'remove').mockResolvedValue(undefined);

    const req = {
      user: {
        id: 2,
        permission: UserPermission.ADMIN,
      },
    };

    await expect(userService.remove(id, req)).rejects.toThrowError(
      `User with id ${id} not found`,
    );
    expect(userRepository.findOne).toHaveBeenCalledWith({ where: { id } });
    expect(userRepository.remove).not.toHaveBeenCalled();
  });
});
