import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserDomain } from '../domain/user.domain';
import { UserEntity } from '../domain/user.entity';
import { UserInterface } from '../interfaces/user.interface';
import * as bcrypt from 'bcrypt';
import { PartialUser } from '../domain/partial-user.domain';

@Injectable()
export class UserService implements UserInterface {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
  ) {}

  async create(userDomain: UserDomain): Promise<UserEntity> {
    const { email } = userDomain;
    const existingUser = await this.userRepository.findOne({
      where: { email },
    });

    if (existingUser) {
      throw new Error('Email already in use');
    }

    const saltOrRounds = 10;
    const hashedPassword = await bcrypt.hash(userDomain.password, saltOrRounds);

    const user = {
      ...userDomain,
      password: hashedPassword,
    };

    return await this.userRepository.save(user);
  }

  async findAll(req): Promise<UserDomain[]> {
    if (req.user.permission === 'admin') {
      return await this.userRepository.find();
    }

    return await this.userRepository.find({
      where: { id: req.user.id },
      select: ['id', 'name', 'email', 'permission', 'phone'],
    });
  }

  async findByNameOrEmail(searchString: string): Promise<UserDomain[]> {
    const users = await this.userRepository
      .createQueryBuilder('user_entity')
      .where('user_entity.name LIKE :query OR user_entity.email LIKE :query', {
        query: `%${searchString}%`,
      })
      .getMany();

    if (users.length === 0) {
      throw new NotFoundException('No users found');
    }

    return users;
  }

  async findByEmail(email: string): Promise<UserDomain> {
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async findById(id: number, req: any): Promise<UserDomain> {
    const user = await this.userRepository.findOne({
      where: { id },
      select: ['id', 'name', 'email', 'permission', 'phone'],
    });

    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }

    if (req.user.permission === 'admin') {
      return user;
    } else if (req.user.permission === 'standard' && req.user.id === user.id) {
      return user;
    } else {
      throw new UnauthorizedException(
        'You do not have permission to view this user',
      );
    }
  }

  async update(id: number, user: PartialUser, req: any): Promise<UserDomain> {
    const { name, email, password, permission, phone } = user;
    const userEntity = await this.userRepository.findOne({ where: { id } });

    console.log(userEntity);

    if (!userEntity) {
      throw new NotFoundException(`User with id ${id} not found`);
    }

    if (req.user.permission === 'admin' || req.user.id === userEntity.id) {
      if (email && email !== userEntity.email) {
        const emailAlreadyExists = await this.userRepository.findOne({
          where: { email },
        });
        if (emailAlreadyExists) {
          throw new Error('Email already in use');
        }
      }

      userEntity.name = name || userEntity.name;
      userEntity.email = email || userEntity.email;
      userEntity.phone = phone || userEntity.phone;
      userEntity.permission = permission || userEntity.permission;
      if (password) {
        const hashedPassword = await bcrypt.hash(password, 10);
        userEntity.password = hashedPassword;
      }

      await this.userRepository.save(userEntity);
      return userEntity;
    } else {
      throw new UnauthorizedException(
        'You do not have permission to update this user',
      );
    }
  }

  async remove(id: number, req: any): Promise<void> {
    if (req.user.permission !== 'admin') {
      throw new UnauthorizedException(
        'You do not have permission to delete this user',
      );
    }
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }

    await this.userRepository.remove(user);
  }
}
