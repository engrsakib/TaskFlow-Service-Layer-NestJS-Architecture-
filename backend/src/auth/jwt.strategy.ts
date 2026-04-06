import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, type JwtFromRequestFunction } from 'passport-jwt';
import type { Role } from './roles.guard';

export interface JwtPayload {
  sub: string | number;
  email: string;
  role: Role;
}

export interface AuthUser {
  id: string | number;
  email: string;
  role: Role;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    const jwtFromRequest: JwtFromRequestFunction = (req: {
      headers?: Record<string, string | string[] | undefined>;
    }) => {
      const authHeader = req.headers?.authorization;

      if (typeof authHeader !== 'string') return null;
      const [scheme, token] = authHeader.split(' ');
      return scheme?.toLowerCase() === 'bearer' && token ? token : null;
    };
    console.log('JWT_SECRET LOADED:', process.env.JWT_SECRET);
    const options = {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      jwtFromRequest,
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'dev-secret',
    };

    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    super(options);
  }

  validate(payload: JwtPayload): AuthUser {
    return {
      id: payload.sub,
      email: payload.email,
      role: payload.role,
    };
  }
}
