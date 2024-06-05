import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { Pesanan, Prisma } from '@prisma/client';
import { OrderlistService } from 'src/orderlist/orderlist.service';

@Injectable()
export class PesananService {
  constructor(private prisma: PrismaService, private orderListService: OrderlistService) {}

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

  async createPesanan(data: any): Promise<Pesanan> {
    const { mitraId,pelangganId, ...pesananData } = data;
    if (!mitraId) throw new BadRequestException(`Mitra id is required`);   
    // Check if pelanggan is provided
    if (!pelangganId) throw new BadRequestException(`Pelanggan Id is required`);   
    // Check if the mitra exists
    const existingMitra = await this.prisma.mitra.findUnique({
      where: { id: mitraId }
    });
    if (!existingMitra) {
      throw new NotFoundException(`M    const existingPelanggan = await this.prisma.pelanggan.findUnique({
        where: { id: pelangganId }
      });itra with ID ${mitraId} not found.`);
    }
    const existingPelanggan = await this.prisma.pelanggan.findUnique({
      where: { id: pelangganId }
    });
    if (!existingPelanggan) {
      throw new NotFoundException(`Pelanggan with ID ${pelangganId} not found.`);
    }
    const now = new Date();
    const invoice = `INVC${existingMitra.nama_toko.slice(0,2).toUpperCase()}${existingMitra.id}${existingPelanggan.nama.slice(0,2).toUpperCase()}${existingPelanggan.id}${Math.floor(now.getTime() / 1000)}`
    return this.prisma.pesanan.create({
      data: {
        invoice,
        ...pesananData,
        mitra: {
          connect: { id: mitraId }
        },
        pelanggan: {
          connect: { id: pelangganId }
        }
      } 
    });
  }

  async createPesananWithOrderList(data: any): Promise<any> {
    const { orderLists, pesananData } = data;
    const { mitraId, pelangganId, ...dataPesanan } = pesananData
    
    // Check if mitraId is provided
    if (!mitraId) throw new BadRequestException(`Mitra id is required`);   
    
    // Check if pelanggan is provided
    if (!pelangganId) throw new BadRequestException(`Pelanggan Id is required`);   
    
    // Check if the mitra exists
    const existingMitra = await this.prisma.mitra.findUnique({
      where: { id: mitraId }
    });
    if (!existingMitra) {
      throw new NotFoundException(`Mitra with ID ${mitraId} not found.`);
    }

    // Check if pelanggan exists
    const existingPelanggan = await this.prisma.pelanggan.findUnique({
      where: { id: pelangganId }
    });
    if (!existingPelanggan) {
      throw new NotFoundException(`Pelanggan with ID ${pelangganId} not found.`);
    }
    const now = new Date();
    const invoice = `INVC${existingMitra.nama_toko.slice(0,2).toUpperCase()}${existingMitra.id}${existingPelanggan.nama.slice(0,2).toUpperCase()}${existingPelanggan.id}${Math.floor(now.getTime() / 1000)}`

    const pesanan = await this.prisma.pesanan.create({
      data: {
        invoice,
        ...dataPesanan,
        mitra: {
          connect: { id: mitraId }
        },
        pelanggan: {
          connect: { id: pelangganId }
        }
      } 
    });

    let responseOrderList = []
    for (let index = 0; index < orderLists.length; index++) {
        const element = orderLists[index];
        responseOrderList.push(await this.orderListService.createOrderList({ pesananId: pesanan.invoice, ...element}));
    }
    return {pesanan, responseOrderList}
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
