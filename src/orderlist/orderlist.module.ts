import { Module } from '@nestjs/common';
import { OrderlistService } from './orderlist.service';
import { OrderlistController } from './orderlist.controller';

@Module({
  providers: [OrderlistService],
  controllers: [OrderlistController]
})
export class OrderlistModule {}
