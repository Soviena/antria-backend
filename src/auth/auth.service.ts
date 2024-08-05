import { HttpException, HttpStatus, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { PelangganService } from '../pelanggan/pelanggan.service';
import { KaryawanService } from 'src/karyawan/karyawan.service';
import { JwtService } from '@nestjs/jwt';
import { MailerService } from '@nestjs-modules/mailer';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
    constructor(
      private pelangganService: PelangganService,
      private karyawanService: KaryawanService,
      private jwtService: JwtService,
      private readonly mailService: MailerService
    ) {}

    async signInPelanggan(username: string, pass: string): Promise<any> {
      const user = await this.pelangganService.findOne(username);
      if (!user) {
        throw new NotFoundException()
      }
      if (! await bcrypt.compare(pass, user.password)) {
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
      if (!user) {
        throw new NotFoundException()
      }
      if (! await bcrypt.compare(pass, user.password)) {
        throw new UnauthorizedException();
      }
      const payload = { 
        sub: user.id, 
        username: user.username, 
        role:"karyawan", 
        mitraId: user.mitraId, 
        picture: user.profile_picture, 
        email:user.email,
        isOwner:user.isOwner,
        admin:false
      };
      return {
        access_token: await this.jwtService.signAsync(payload),
      };
    }

    async sendForgotPasswordMail(userType: string,email: string): Promise<any>{
      let n = Math.floor(Math.random() * 9999)
      let ns = String(n).padStart(4, '0')
      if (userType === "pelanggan") {
        const user = await this.pelangganService.findOneEmail(email);
        if (!user) {
          return
        }
        await this.pelangganService.updatePelanggan({
          where: { email: email },
          data: {
            otp: ns
          },
        })
      }else if (userType === "karyawan") {
        const user = await this.karyawanService.findOneEmail(email);
        if (!user) {
          return
        }
        await this.karyawanService.updateKaryawan({
          where: { email: email },
          data: {
            otp: ns
          },
        })
      }else{
        return
      }
      const message = `Forgot your password? If you didn't forget your password, please ignore this email!\nYour OTP is ${ns}`;
      this.mailService.sendMail({
        from: 'noreply@antria.id',
        to: email,
        subject: `Forgot Password`,
        text: message,
      });
      return {
        status: "success, check your email"
      }
    }

    async verifyOtp(userType: string, email:string, otp:string): Promise<any>{
      if (userType === "pelanggan") {
        const user = await this.pelangganService.findOneEmail(email);
        if (!user) {
          throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
        }
        if (user.otp === otp){
          await this.pelangganService.updatePelanggan({
            where: { email: email },
            data: {
              otp: ""
            },
          })
          return {
            status: "success"
          }
        }else {
          throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
        }
      }else if (userType === "karyawan") {
        const user = await this.karyawanService.findOneEmail(email);
        if (!user) {
          throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
        }
        if (user.otp === otp){
          await this.karyawanService.updateKaryawan({
            where: { email: email },
            data: {
              otp: ""
            },
          })
          return {
            status: "success"
          }
        }else {
          throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
        }
      }else{
        throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
      }
    }
}
