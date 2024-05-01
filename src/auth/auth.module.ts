import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { PelangganModule } from 'src/pelanggan/pelanggan.module';
import { jwtConstants } from './constants';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    PelangganModule,
    JwtModule.register({
      global: true,
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '1d' },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [AuthService]
})
export class AuthModule {}
