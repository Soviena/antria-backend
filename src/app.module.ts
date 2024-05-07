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
import { KaryawanModule } from './karyawan/karyawan.module';
import { PesananModule } from './pesanan/pesanan.module';
import { OrderlistModule } from './orderlist/orderlist.module';
import { AntrianModule } from './antrian/antrian.module';


@Module({
  imports: [ConfigModule.forRoot(), AuthModule, PelangganModule, MitraModule, ProdukModule, KaryawanModule, PesananModule, OrderlistModule, AntrianModule],
  controllers: [AppController],
  providers: [AppService, UserService, PostService, PrismaService],
})
export class AppModule {}
