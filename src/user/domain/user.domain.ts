import {
  IsEmail,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export enum UserPermission {
  STANDARD = 'standard',
  ADMIN = 'admin',
}

export class UserDomain {
  @IsNumber()
  @IsOptional()
  id?: number;

  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  password: string;

  @IsEnum(UserPermission)
  permission: UserPermission;

  @IsString()
  phone: string;
}
