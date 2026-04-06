import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from './roles.decorator';

export type Role = 'ADMIN' | 'USER';

export interface AuthUser {
  id: string | number;
  email: string;
  role: Role;
}

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(ctx: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(
      ROLES_KEY,

      [ctx.getHandler(), ctx.getClass()],
    );

    if (!requiredRoles || requiredRoles.length === 0) return true;

    const request = ctx.switchToHttp().getRequest<{ user?: AuthUser }>();
    const user = request.user;
    console.log('🔥 RolesGuard user:', user);
    if (!user) return false;

    return requiredRoles.includes(user.role);
  }
}
