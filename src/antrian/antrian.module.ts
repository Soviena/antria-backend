import { Module } from '@nestjs/common';
import { AntrianService } from './antrian.service';
import { AntrianController } from './antrian.controller';

@Module({
  providers: [AntrianService],
  controllers: [AntrianController]
})
export class AntrianModule {}
