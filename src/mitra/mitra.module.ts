import { Module } from '@nestjs/common';
import { MitraService } from './mitra.service';
import { MitraController } from './mitra.controller';
import { PrismaService } from 'src/prisma.service';
import { KaryawanService } from 'src/karyawan/karyawan.service';

@Module({
  providers: [MitraService,PrismaService,KaryawanService],
  controllers: [MitraController],
  exports: [MitraService]
})
export class MitraModule {}
