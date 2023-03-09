import { Test } from '@nestjs/testing';
import { UserEntity } from '../domain/user.entity';
import { UserPermission } from '../domain/user.domain';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UserService } from '../services/user.service';

describe('UserService', () => {
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

  describe('findAll', () => {
    it('should return all users if the user has admin permission', async () => {
      const users = [
        {
          id: 1,
          name: 'Nextar User',
          email: 'nextar@example.com',
          phone: '123456789',
          password: 'password',
          permission: UserPermission.STANDARD,
        },
        {
          id: 2,
          name: 'Nextar User Sec',
          email: 'nextarsec@example.com',
          phone: '987654321',
          password: 'password123',
          permission: UserPermission.STANDARD,
        },
      ];

      jest.spyOn(userRepository, 'find').mockResolvedValue(users);

      const req = {
        user: {
          id: 1,
          permission: UserPermission.ADMIN,
        },
      };

      const result = await userService.findAll(req);

      expect(userRepository.find).toHaveBeenCalled();
      expect(result).toEqual(users);
    });

    it('should return the user profile if the user has standard permission', async () => {
      const user = {
        id: 1,
        name: 'Nextar User',
        email: 'nextar@example.com',
        permission: UserPermission.STANDARD,
        phone: '123456789',
        password: 'password',
      };

      jest.spyOn(userRepository, 'find').mockResolvedValue([user]);

      const req = {
        user,
      };

      const result = await userService.findAll(req);

      expect(userRepository.find).toHaveBeenCalledWith({
        where: { id: req.user.id },
        select: ['id', 'name', 'email', 'permission', 'phone'],
      });
      expect(result).toEqual([user]);
    });

    it('should not return confidential information', async () => {
      const users = [
        {
          id: 1,
          name: 'Nextar User',
          email: 'nextar@example.com',
          phone: '123456789',
          password: 'password',
          permission: UserPermission.STANDARD,
        },
        {
          id: 2,
          name: 'Nextar User Sec',
          email: 'nextarsec@example.com',
          phone: '987654321',
          password: 'password123',
          permission: UserPermission.STANDARD,
        },
      ];

      jest.spyOn(userRepository, 'find').mockResolvedValue(users);
      const req = {
        user: {
          id: 1,
          permission: UserPermission.ADMIN,
        },
      };

      const result = await userService.findAll(req);

      expect(userRepository.find).toHaveBeenCalled();
      expect(result).toEqual([
        {
          id: 1,
          name: 'Nextar User',
          email: 'nextar@example.com',
          phone: '123456789',
          password: 'password',
          permission: UserPermission.STANDARD,
        },
        {
          id: 2,
          name: 'Nextar User Sec',
          email: 'nextarsec@example.com',
          phone: '987654321',
          password: 'password123',
          permission: UserPermission.STANDARD,
        },
      ]);
    });
  });
});
