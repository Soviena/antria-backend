import { Body, Controller, Get, HttpCode, HttpStatus, Post, UseGuards, Request, Param } from '@nestjs/common';
import { AuthService } from './auth.service';
import MitraOnlyId, { AuthGuard, MitraOnly, OwnerOnly } from './auth.guards';
import { ApiTags } from '@nestjs/swagger';
import { LoginPelangganDto } from './dto/loginPelanggan.dto';
import { LoginMitraDto } from './dto/loginMitra.dto';

@Controller('auth')
@ApiTags('auth')

export class AuthController {
    constructor(private authService: AuthService) {}

    @HttpCode(HttpStatus.OK)
    @Post('login/pelanggan')
    async signInPelanggan(@Body() signInDto: LoginPelangganDto) {
        return this.authService.signInPelanggan(signInDto.username, signInDto.password);
    }

    @HttpCode(HttpStatus.OK)
    @Post('login/mitra')
    async signInMitra(@Body() signInDto: LoginMitraDto) {
        return this.authService.signInMitra(signInDto.username, signInDto.password);
    }

    @Post('forgot/:userType/:email')
    forgotPassword(
        @Param('userType') userType: string,
        @Param('email') email: string
    ) {
        return this.authService.sendForgotPasswordMail(userType,email);
    }

    @Post('verify-otp/:userType/:email/:otp')
    verifyOtp(
        @Param('userType') userType: string,
        @Param('email') email: string,
        @Param('otp') otp: string
    ) {
        return this.authService.verifyOtp(userType,email,otp);
    }

    @Get('profile')
    @UseGuards(AuthGuard,MitraOnly)
    getProfile(@Request() req) {
        return req.user;
    }
    @Get('profile2/:id')
    @UseGuards(AuthGuard,MitraOnly,MitraOnlyId('id'),OwnerOnly)
    getProfile2(@Request() req) {
        return req.user;
    }
}
