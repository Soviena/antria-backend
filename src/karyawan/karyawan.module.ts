import { Module } from '@nestjs/common';
import { KaryawanService } from './karyawan.service';
import { KaryawanController } from './karyawan.controller';
import { PrismaService } from 'src/prisma.service';

@Module({
  providers: [KaryawanService,PrismaService],
  controllers: [KaryawanController],
  exports:[KaryawanService]
})
export class KaryawanModule {}
