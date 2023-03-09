import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';

@Injectable()
export class PermissionGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const permission = this.reflector.get('permission', context.getHandler());
    if (!permission) {
      return true;
    }
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    return user.permission == permission;
  }
}
