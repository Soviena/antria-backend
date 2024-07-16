import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { OrderStatus, PaymentStatus, Pesanan, Prisma } from '@prisma/client';
import { OrderlistService } from 'src/orderlist/orderlist.service';
import { AntrianService } from 'src/antrian/antrian.service';


@Injectable()
export class PesananService {
  constructor(
    private prisma: PrismaService,
    private orderListService: OrderlistService,
    private antrianService: AntrianService
  ) {}

  async pesanan(
    pesananWhereUniqueInput: Prisma.PesananWhereUniqueInput,
  ): Promise<Pesanan | null> {
    return this.prisma.pesanan.findUnique({
      where: pesananWhereUniqueInput,
      include:{
        pelanggan: true,
        antrian: true,
        oderlist: {
          include: {produk: true}
        },
      }
    });

  }

  async pesanans(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.PesananWhereUniqueInput;
    where?: Prisma.PesananWhereInput;
    orderBy?: Prisma.PesananOrderByWithRelationInput;
  }): Promise<Pesanan[]> {
    const { skip, take, cursor, where, orderBy } = params;
    return this.prisma.pesanan.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
    });
  }

  async createPesanan(data: any): Promise<any> {
    const { order_lists, pesanan } = data;
    let { pemesanan,mitraId,pelangganId,invoice,status, ...pesananData } = pesanan;
    if (!mitraId) throw new BadRequestException(`Mitra id is required`);   
    if (!pelangganId && pemesanan != "OFFLINE") throw new BadRequestException(`Pelanggan Id is required`);   
    const existingMitra = await this.prisma.mitra.findUnique({
      where: { id: mitraId }
    });
    if (!existingMitra) {
      throw new NotFoundException(`Mitra with ID ${mitraId} not found.`);
    }
    if (!pelangganId) {
      pelangganId = 0
    }
    var existingPelanggan = await this.prisma.pelanggan.findUnique({
      where: { id: pelangganId }
    });
    if (!existingPelanggan) {
      throw new NotFoundException(`Pelanggan with ID ${pelangganId} not found.`);
    }
    if (!invoice){
      let now = new Date();
      invoice = `INVC${existingMitra.nama_toko.slice(0,2).toUpperCase()}${existingMitra.id}${existingPelanggan.nama.slice(0,2).toUpperCase()}${existingPelanggan.id}${Math.floor(now.getTime() / 1000)}`
    }

    let p = await this.prisma.pesanan.create({
      data: {
        invoice,
        status,
        pemesanan,
        ...pesananData,
        mitra: {
          connect: { id: mitraId }
        },
        pelanggan: {
          connect: { id: pelangganId }
        }
      }
    });
    if (order_lists){
      var responseOrderList = []
      for (let index = 0; index < order_lists.length; index++) {
          const element = order_lists[index];
          responseOrderList.push(await this.orderListService.createOrderList({ pesananId: invoice, ...element}));
      }
    }

    if (!status || status != "SUCCESS") {
      return {pesanan: p, orderlists: responseOrderList}
    }
    const antrian = await this.antrianService.createAntrian({
      estimasi:30,
      pesananInvoice:invoice
    });
    let pa = await this.updatePesanan({
      where: { invoice },
      data: {
        antrianId: antrian.id
      }
    });
    return {pesanan: pa, orderlists: responseOrderList}
  }

  async updatePesanan(params: {
    where: Prisma.PesananWhereUniqueInput;
    data: Prisma.PesananUpdateInput;
  }): Promise<Pesanan> {
    const { where, data } = params;
    return this.prisma.pesanan.update({
      data,
      where,
    });
  }

  async deletePesanan(where: Prisma.PesananWhereUniqueInput): Promise<Pesanan> {
    return this.prisma.pesanan.delete({
      where,
    });
  }

  async pesanansByMitraId(mitraId: number): Promise<Pesanan[]> {
    return this.prisma.pesanan.findMany({
      where: {
        mitraId: mitraId,
      },
      include: { 
        oderlist: {
          include: {produk: true}
        },
        pelanggan: true,
        antrian: true
      }
    });
  }

  async pesanansByPelangganId(pelangganId: number): Promise<Pesanan[]> {
    return this.prisma.pesanan.findMany({
      where: {
        pelangganId: pelangganId
      },
      include: { 
        oderlist: {
          include: {produk: true}
        },
      }
    });
  }

  async pesanansByPelangganIdStatus(pelangganId: number, s: string, data:any): Promise<Pesanan[]> {
    let where: { pelangganId?: number; status?: PaymentStatus; antrian?: {orderstatus: OrderStatus}}
    where = {}
    switch (s.toUpperCase()) {
      case "PENDING":
        where.status = "PENDING"
        break;
      case "SUCCESS":
        where.status = "SUCCESS"
        break;
      case "FAILED":
        where.status = "FAILED"
        break;
    }
    where.pelangganId = pelangganId
    if (data.status_order) {
      console.log(data.status_order)
      where.antrian = {orderstatus: data.status_order}
    }
    return this.prisma.pesanan.findMany({
      where,
      include: { 
        oderlist: {
          include: {produk: true}
        },
        pelanggan: true,
        antrian: true
      }
    });
  }

  async pesanansByMitraIdSuccess(mitraId: number): Promise<Pesanan[]> {
    return this.prisma.pesanan.findMany({
      where: {
        mitraId: mitraId,
        status:"SUCCESS"
      },
      include: { 
        oderlist: {
          include: {produk: true}
        },
        pelanggan: true,
        antrian: true
      }
    });
  }
}
