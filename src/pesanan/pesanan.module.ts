import { Module } from '@nestjs/common';
import { PesananService } from './pesanan.service';
import { PesananController } from './pesanan.controller';
import { PrismaService } from 'src/prisma.service';

@Module({
  providers: [PesananService,PrismaService],
  controllers: [PesananController],
  exports: [PesananService]
})
export class PesananModule {}
