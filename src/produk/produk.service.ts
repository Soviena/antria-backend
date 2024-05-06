import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { Produk, Prisma } from '@prisma/client';

@Injectable()
export class ProdukService {
  constructor(private prisma: PrismaService) {}

  async produk(
    produkWhereUniqueInput: Prisma.ProdukWhereUniqueInput,
  ): Promise<Produk | null> {
    return this.prisma.produk.findUnique({
      where: produkWhereUniqueInput,
    });
  }

  async produks(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.ProdukWhereUniqueInput;
    where?: Prisma.ProdukWhereInput;
    orderBy?: Prisma.ProdukOrderByWithRelationInput;
  }): Promise<Produk[]> {
    const { skip, take, cursor, where, orderBy } = params;
    return this.prisma.produk.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
    });
  }

  async createProduk(data: Prisma.ProdukCreateInput): Promise<Produk> {
    const { mitra, ...produkData } = data;
    
    // Check if mitraId is provided
    if (!mitra || !mitra.connect || !mitra.connect.id) {
      throw new Error('Mitra ID is required.');
    }

    // Check if the mitra exists
    const existingMitra = await this.prisma.mitra.findUnique({
      where: { id: mitra.connect.id }
    });
    if (!existingMitra) {
      throw new NotFoundException(`Mitra with ID ${mitra.connect.id} not found.`);
    }

    return this.prisma.produk.create({
      data: {
        ...produkData,
        mitra: {
          connect: { id: mitra.connect.id }
        }
      },
    });
  }

  async updateProduk(params: {
    where: Prisma.ProdukWhereUniqueInput;
    data: Prisma.ProdukUpdateInput;
  }): Promise<Produk> {
    const { where, data } = params;
    return this.prisma.produk.update({
      data,
      where,
    });
  }

  async deleteProduk(where: Prisma.ProdukWhereUniqueInput): Promise<Produk> {
    return this.prisma.produk.delete({
      where,
    });
  }
  
  async produksByMitraId(mitraId: number): Promise<Produk[]> {
    return this.prisma.produk.findMany({
      where: {
        mitraId: mitraId,
      },
    });
  }
}
