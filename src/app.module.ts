import { Module } from '@nestjs/common';
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
import { ReviewModule } from './review/review.module';
import { ImageModule } from './image/image.module';

@Module({
  imports: [ConfigModule.forRoot(), AuthModule, PelangganModule, MitraModule, ProdukModule, KaryawanModule, PesananModule, OrderlistModule, AntrianModule, ReviewModule, ImageModule],
  controllers: [],
  providers: [PrismaService],
})
export class AppModule {}
