import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserService } from './models/user.service';
import { PostService } from './models/post.service';
import { PrismaService } from './prisma.service';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { PelangganModule } from './pelanggan/pelanggan.module';
import { MitraModule } from './mitra/mitra.module';
import { ProdukModule } from './produk/produk.module';


@Module({
  imports: [ConfigModule.forRoot(), AuthModule, PelangganModule, MitraModule, ProdukModule],
  controllers: [AppController],
  providers: [AppService, UserService, PostService, PrismaService],
})
export class AppModule {}
