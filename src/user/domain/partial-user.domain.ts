import { IsString, IsEmail, IsEnum, IsOptional } from 'class-validator';
import { UserPermission } from './user.domain';

export class PartialUser implements PartialUser {
  @IsString()
  @IsOptional()
  readonly name: string;

  @IsString()
  @IsOptional()
  readonly password: string;

  @IsEmail()
  @IsOptional()
  readonly email: string;

  @IsString()
  @IsOptional()
  readonly phone: string;

  @IsEnum(UserPermission)
  @IsOptional()
  readonly permission: UserPermission;
}
