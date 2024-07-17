import { Body, Controller, Get, HttpCode, HttpStatus, Post, UseGuards, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import MitraOnlyId, { AuthGuard, MitraOnly } from './auth.guards';
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

    @Get('profile')
    @UseGuards(AuthGuard,MitraOnly)
    getProfile(@Request() req) {
        return req.user;
    }
}
