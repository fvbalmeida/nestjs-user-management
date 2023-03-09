import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { UserService } from '../services/user.service';
import { UserEntity } from '../domain/user.entity';
import { UserDomain } from '../domain/user.domain';
import { UserPermission } from '../domain/user.domain';

describe('CreateUser', () => {
  let userService: UserService;
  let userRepository: Repository<UserEntity>;

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

  it('should create a user', async () => {
    const userDomain: UserDomain = {
      name: 'Nextar User',
      email: 'nextar@example.com',
      password: 'password123',
      permission: UserPermission.STANDARD,
      phone: '1234567890',
    };

    const hashedPassword = 'hashedpassword' as never;

    const findOneSpy = jest
      .spyOn(userRepository, 'findOne')
      .mockResolvedValue(null);

    const hashSpy = jest
      .spyOn(bcrypt, 'hash')
      .mockResolvedValue(hashedPassword);

    const saveSpy = jest.spyOn(userRepository, 'save').mockResolvedValue({
      id: 1,
      name: userDomain.name,
      email: userDomain.email,
      password: hashedPassword,
      permission: userDomain.permission,
      phone: userDomain.phone,
    });

    const result = await userService.create(userDomain);

    expect(findOneSpy).toHaveBeenCalledWith({
      where: { email: userDomain.email },
    });
    expect(hashSpy).toHaveBeenCalledWith(userDomain.password, 10);
    expect(saveSpy).toHaveBeenCalledWith({
      ...userDomain,
      password: hashedPassword,
    });
    expect(result).toEqual({
      id: 1,
      name: userDomain.name,
      email: userDomain.email,
      password: hashedPassword,
      permission: userDomain.permission,
      phone: userDomain.phone,
    });
  });

  it('should throw an error if the email is already in use', async () => {
    const userDomain: UserDomain = {
      name: 'Nextar User',
      email: 'nextar@example.com',
      password: 'password123',
      permission: UserPermission.STANDARD,
      phone: '1234567890',
    };

    const existingUser = {
      id: 1,
      name: 'Nextar User Sec',
      email: 'nextar@example.com',
      password: 'hashedpassword',
      permission: UserPermission.ADMIN,
      phone: '0987654321',
    };

    const findOneSpy = jest
      .spyOn(userRepository, 'findOne')
      .mockResolvedValue(existingUser);

    await expect(userService.create(userDomain)).rejects.toThrow(
      'Email already in use',
    );

    expect(findOneSpy).toHaveBeenCalledWith({
      where: { email: userDomain.email },
    });
  });
});
