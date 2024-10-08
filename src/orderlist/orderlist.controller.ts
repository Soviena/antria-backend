import { Controller, Get, Post, Put, Delete, Param, Body, UseGuards } from '@nestjs/common';

import { OrderList, Prisma } from '@prisma/client';
import { OrderlistService } from './orderlist.service';
import { ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/auth/auth.guards';

@Controller('orderlist')
@ApiTags('orderlist')

export class OrderlistController {
  constructor(private orderListService: OrderlistService) {}

  @Post()
  @UseGuards(AuthGuard)
  async create(@Body() data: Prisma.OrderListCreateInput): Promise<OrderList> {
    return this.orderListService.createOrderList(data);
  }

  @Post('bulk')
  @UseGuards(AuthGuard)
  async createMany(@Body() data: Prisma.OrderListCreateManyInput[]): Promise<OrderList[]> {
    let response = []
    for (let index = 0; index < data.length; index++) {
        const element = data[index];
        response.push(await this.orderListService.createOrderList(element));
    }
    return response;
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  async findOne(@Param('id') id: string): Promise<OrderList | null> {
    return this.orderListService.getOrderListById(Number(id));
  }

  @Get('invoice/:invoice')
  @UseGuards(AuthGuard)
  async getAllOrderFromInvoice(@Param('invoice') invoice: string): Promise<OrderList[] | null> {
    return this.orderListService.getOrderListByInvoice(invoice);
  }

  @Put(':id')
  @UseGuards(AuthGuard)
  async update(@Param('id') id: string, @Body() data: Prisma.OrderListUpdateInput): Promise<OrderList> {
    return this.orderListService.updateOrderList({
      where: { id: Number(id) },
      data,
    });
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  async remove(@Param('id') id: string): Promise<OrderList> {
    return this.orderListService.deleteOrderList({ id: Number(id) });
  }
}
