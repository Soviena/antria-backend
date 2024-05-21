import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { Pesanan, Prisma } from '@prisma/client';

@Injectable()
export class PesananService {
  constructor(private prisma: PrismaService) {}

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

  async createPesanan(data: Prisma.PesananCreateInput): Promise<Pesanan> {
    const { mitra,pelanggan, ...pesananData } = data;
    
    // Check if mitraId is provided
    if (!mitra || !mitra.connect || !mitra.connect.id) {
      throw new Error('Mitra ID is required.');
    }
    // Check if pelanggan is provided
    if (!pelanggan || !pelanggan.connect || !pelanggan.connect.id) {
      throw new Error('Pelanggan ID is required.');
    }

    // Check if the mitra exists
    const existingMitra = await this.prisma.mitra.findUnique({
      where: { id: mitra.connect.id }
    });
    if (!existingMitra) {
      throw new NotFoundException(`Mitra with ID ${mitra.connect.id} not found.`);
    }

    // Check if pelanggan exists
    const existingPelanggan = await this.prisma.pelanggan.findUnique({
      where: { id: pelanggan.connect.id }
    });
    if (!existingPelanggan) {
      throw new NotFoundException(`Pelanggan with ID ${pelanggan.connect.id} not found.`);
    }


    return this.prisma.pesanan.create({
      data: {
        ...pesananData,
        mitra: {
          connect: { id: mitra.connect.id }
        },
        pelanggan: {
          connect: { id: pelanggan.connect.id }
        }
      } 
    });
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
}
