import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PelangganService } from '../pelanggan/pelanggan.service';
import { KaryawanService } from 'src/karyawan/karyawan.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
    constructor(
      private pelangganService: PelangganService,
      private karyawanService: KaryawanService,
      private jwtService: JwtService
    ) {}

    async signInPelanggan(username: string, pass: string): Promise<any> {
      const user = await this.pelangganService.findOne(username);
      if (!bcrypt.compare(user?.password, pass)) {
        throw new UnauthorizedException();
      }
      const payload = { 
        sub: user.id, 
        username: user.username, 
        role:"pelanggan", 
        picture: user.profile_picture, 
        email:user.email 
      };
      return {
        access_token: await this.jwtService.signAsync(payload),
      };
    }

    async signInMitra(username: string, pass: string): Promise<any> {
      const user = await this.karyawanService.findOne(username);
      if (!bcrypt.compare(user?.password, pass)) {
        throw new UnauthorizedException();
      }
      const payload = { 
        sub: user.id, 
        username: user.username, 
        role:"karyawan", 
        mitraId: user.mitraId, 
        picture: user.profile_picture, 
        email:user.email 
      };
      return {
        access_token: await this.jwtService.signAsync(payload),
      };
    }
}
