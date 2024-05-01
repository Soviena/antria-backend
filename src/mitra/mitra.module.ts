import { Module } from '@nestjs/common';
import { MitraService } from './mitra.service';
import { MitraController } from './mitra.controller';
import { PrismaService } from 'src/prisma.service';

@Module({
  providers: [MitraService,PrismaService],
  controllers: [MitraController],
  exports: [MitraService]
})
export class MitraModule {}
