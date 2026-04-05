import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import type { AuthUser } from './roles.guard';

export const GetUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): AuthUser | null => {
    const request = ctx.switchToHttp().getRequest<{ user?: AuthUser }>();
    return request.user ?? null;
  },
);
