import { Controller, Get, Post, Put, Delete, Param, Body } from '@nestjs/common';

import { OrderList, Prisma } from '@prisma/client';
import { OrderlistService } from './orderlist.service';

@Controller('orderlist')
export class OrderlistController {
  constructor(private orderListService: OrderlistService) {}

  @Post()
  async create(@Body() data: Prisma.OrderListCreateInput): Promise<OrderList> {
    return this.orderListService.createOrderList(data);
  }

  @Post('bulk')
  async createMany(@Body() data: Prisma.OrderListCreateManyInput[]): Promise<OrderList[]> {
    let response = []
    for (let index = 0; index < data.length; index++) {
        const element = data[index];
        response.push(await this.orderListService.createOrderList(element));
    }
    return response;
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<OrderList | null> {
    return this.orderListService.getOrderListById(Number(id));
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() data: Prisma.OrderListUpdateInput): Promise<OrderList> {
    return this.orderListService.updateOrderList({
      where: { id: Number(id) },
      data,
    });
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<OrderList> {
    return this.orderListService.deleteOrderList({ id: Number(id) });
  }
}
