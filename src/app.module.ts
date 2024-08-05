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
import { MailerModule } from '@nestjs-modules/mailer';

@Module({
  imports: [ConfigModule.forRoot({ envFilePath: '.env', isGlobal: true }), AuthModule, PelangganModule, MitraModule, ProdukModule, KaryawanModule, PesananModule, OrderlistModule, AntrianModule, ReviewModule, ImageModule,
    MailerModule.forRoot({
      transport: {
        host: process.env.EMAIL_HOST,
        port: parseInt(process.env.EMAIL_PORT),
        auth: {
          user: process.env.EMAIL_USERNAME,
          pass: process.env.EMAIL_PASSWORD,
        },
      },
    }),
  ],
  controllers: [],
  providers: [PrismaService],
})
export class AppModule {}
