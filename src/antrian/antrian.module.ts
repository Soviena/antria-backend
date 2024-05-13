import { Module } from '@nestjs/common';
import { AntrianService } from './antrian.service';
import { AntrianController } from './antrian.controller';
import { PrismaService } from 'src/prisma.service';

@Module({
  providers: [AntrianService,PrismaService],
  controllers: [AntrianController],
  exports: [AntrianService]
})
export class AntrianModule {}
