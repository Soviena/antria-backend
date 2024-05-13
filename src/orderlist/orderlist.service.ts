import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { OrderList, Prisma } from '@prisma/client';

@Injectable()
export class OrderlistService {
  constructor(private prisma: PrismaService) {}

  async createOrderList(data: any): Promise<OrderList> {
    return this.upsertOrderListWherePesananIdANDProdukIdIsTheSame({
      produkId: data.produkId,
      pesananId: data.pesananId,
      data
    });
  }


  async getOrderListById(id: number): Promise<OrderList | null> {
    return this.prisma.orderList.findUnique({
      where: {
        id,
      },
    });
  }

  async getOrderListByInvoice(invoice: string): Promise<OrderList[] | null> {
    return this.prisma.orderList.findMany({
      where: {
        pesananId:invoice,
      },
    });
  }

  async updateOrderList(params: {
    where: Prisma.OrderListWhereUniqueInput;
    data: Prisma.OrderListUpdateInput;
  }): Promise<OrderList> {
    const { where, data } = params;
    return this.prisma.orderList.update({
      data,
      where,
    });
  }

  async upsertOrderListWherePesananIdANDProdukIdIsTheSame(params: {
    produkId: number;
    pesananId: string;
    data: Prisma.OrderListCreateInput;
  }): Promise<OrderList | null> {
    const order = await this.prisma.orderList.findFirst({
      where: {
        AND: [
          {produkId:params.produkId},
          {pesananId:params.pesananId}
        ]
      }
    })
    return this.prisma.orderList.upsert({
      where: {id : order ? order.id : -1},
      create: params.data,
      update: {
        quantity: params.data.quantity,
        note: params.data.note
      }
    });
    
  };

  async deleteOrderList(where: Prisma.OrderListWhereUniqueInput): Promise<OrderList> {
    return this.prisma.orderList.delete({
      where,
    });
  }
}
