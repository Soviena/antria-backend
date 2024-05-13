import { Module } from '@nestjs/common';
import { OrderlistService } from './orderlist.service';
import { OrderlistController } from './orderlist.controller';
import { PrismaService } from 'src/prisma.service';

@Module({
  providers: [OrderlistService,PrismaService],
  controllers: [OrderlistController],
  exports: [OrderlistService]
})
export class OrderlistModule {}
