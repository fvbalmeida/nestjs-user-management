import { Test } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { AuthService } from '../auth.service';
import { UnauthorizedException } from '@nestjs/common';
import { UserDomain } from 'src/user/domain/user.domain';
import { UserService } from '../../../user/services/user.service';

describe('Login', () => {
  let authService: AuthService;
  let userService: UserService;
  let jwtService: JwtService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UserService,
          useValue: {
            findByEmail: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn(),
          },
        },
      ],
    }).compile();

    authService = moduleRef.get<AuthService>(AuthService);
    userService = moduleRef.get<UserService>(UserService);
    jwtService = moduleRef.get<JwtService>(JwtService);
  });

  const email = 'nextar@example.com';
  const password = 'password';
  const user = {
    id: 1,
    name: 'Nextar User',
    email: 'nextar@example.com',
    password: 'password',
    permission: 'standard',
  } as UserDomain;
  const token = 'jwt.token';

  it('should return a JWT token when credentials are valid', async () => {
    jest.spyOn(userService, 'findByEmail').mockResolvedValue(user);
    jest.spyOn(bcrypt, 'compare').mockResolvedValue(true as never);
    jest.spyOn(jwtService, 'sign').mockReturnValue(token);

    const result = await authService.login(email, password);

    expect(result).toEqual({
      payload: { email, id: user.id, permission: user.permission },
      token,
    });
    expect(userService.findByEmail).toHaveBeenCalledWith(email);
    expect(bcrypt.compare).toHaveBeenCalledWith(password, user.password);
    expect(jwtService.sign).toHaveBeenCalledWith({
      email,
      id: user.id,
      permission: user.permission,
    });
  });

  it('should throw an UnauthorizedException when credentials are invalid', async () => {
    jest.spyOn(userService, 'findByEmail').mockResolvedValue(user);
    jest.spyOn(bcrypt, 'compare').mockResolvedValue(false as never);

    await expect(authService.login(email, password)).rejects.toThrowError(
      UnauthorizedException,
    );

    expect(userService.findByEmail).toHaveBeenCalledWith(email);
    expect(bcrypt.compare).toHaveBeenCalledWith(password, user.password);
  });
});
