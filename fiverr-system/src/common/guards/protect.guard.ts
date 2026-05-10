import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

import { Request } from 'express';
import { TokenExpiredError } from 'jsonwebtoken';
import { TokenService } from '../../modules-system/token/token.service';
import { IS_PUBLIC_KEY } from '../../common/decorators/public.decorator';
import { Reflector } from '@nestjs/core';
import { PrismaService } from '../../modules-system/prisma/prisma.service';
import { ROLES_KEY } from '../decorators/role.decorator';

@Injectable()
export class ProtectGuard implements CanActivate {
  constructor(
    private tokenService: TokenService,
    private reflector: Reflector,
    private prisma: PrismaService,
  ) { }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      return true;
    }

    const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);


    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    if (!token) {
      throw new UnauthorizedException();
    }
    try {
      const payload = await this.tokenService.verifyAccessToken(token);

      const userExist = await this.prisma.users.findUnique({
        where: { id: (payload as any).userId },
      });

      if (!userExist) {
        throw new UnauthorizedException('User not found');
      }

      if (requiredRoles && requiredRoles.length > 0) {
        const hasRole = requiredRoles.includes(userExist.role);
        if (!hasRole) {
          throw new ForbiddenException('You are not allowed to access this resource');
        }
      }
      request['user'] = userExist;
    } catch (err) {
      if (err instanceof ForbiddenException || err instanceof UnauthorizedException) {
        throw err;
      }
      if (err instanceof TokenExpiredError) {
        throw new UnauthorizedException('Token is expired. Please log in again.');
      }
      throw new UnauthorizedException('Token is invalid or has expired');
    }
    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
