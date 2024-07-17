import {
    CanActivate,
    ExecutionContext,
    Injectable,
    mixin,
    Type,
    UnauthorizedException,
  } from '@nestjs/common';
  import { JwtService } from '@nestjs/jwt';
  import { jwtConstants } from './constants';
  import { Request } from 'express';

  @Injectable()
  export class AuthGuard implements CanActivate {
    constructor(private jwtService: JwtService) {}
  
    async canActivate(context: ExecutionContext): Promise<boolean> {
      const request = context.switchToHttp().getRequest();
      const token = this.extractTokenFromHeader(request);
      if (!token) {
        throw new UnauthorizedException();
      }
      try {
        const payload = await this.jwtService.verifyAsync(
          token,
          {
            secret: jwtConstants.secret
          }
        );
        request['user'] = payload;
      } catch {
        throw new UnauthorizedException();
      }
      return true;
    }
    private extractTokenFromHeader(request: Request): string | undefined {
      const [type, token] = request.headers.authorization?.split(' ') ?? [];
      return type === 'Bearer' ? token : undefined;
    }
  }

  @Injectable()
  export class MitraOnly implements CanActivate {
  
    async canActivate(context: ExecutionContext): Promise<boolean> {
      const request = context.switchToHttp().getRequest();
      if(request['user'].role != 'karyawan') return false;
      return true;
    }

  }

  @Injectable()
  export class OwnerOnly implements CanActivate {
  
    async canActivate(context: ExecutionContext): Promise<boolean> {
      const request = context.switchToHttp().getRequest();
      return request['user'].isOwner;
    }
  }

  @Injectable()
  export class AdminOnly implements CanActivate {
  
    async canActivate(context: ExecutionContext): Promise<boolean> {
      const request = context.switchToHttp().getRequest();
      return request['user'].admin;
    }

  }

  const MitraOnlyId = (id: string): Type<CanActivate> => {
    @Injectable()
    class MitraOnlyIdGuard implements CanActivate {
      async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const user = request['user'];
        const paramValue = parseInt(request.params[id]);

        // Implement your logic using the parameter here
        return user.mitraId === paramValue;
      }
    }
    return mixin(MitraOnlyIdGuard);
  };
  export default MitraOnlyId;
