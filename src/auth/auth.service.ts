import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PelangganService } from '../pelanggan/pelanggan.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
    constructor(
      private pelangganService: PelangganService,
      private jwtService: JwtService
    ) {}

    async signIn(username: string, pass: string): Promise<any> {
      const user = await this.pelangganService.findOne(username);
      if (!bcrypt.compare(user?.password, pass)) {
        throw new UnauthorizedException();
      }
      const payload = { sub: user.id, username: user.username };
      return {
        access_token: await this.jwtService.signAsync(payload),
      };
    }
}
