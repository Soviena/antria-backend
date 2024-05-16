import { Module } from '@nestjs/common';
import { PesananService } from './pesanan.service';
import { PesananController } from './pesanan.controller';
import { PrismaService } from 'src/prisma.service';
import { AntrianService } from 'src/antrian/antrian.service';

@Module({
  providers: [PesananService,PrismaService,AntrianService],
  controllers: [PesananController],
  exports: [PesananService]
})
export class PesananModule {}
