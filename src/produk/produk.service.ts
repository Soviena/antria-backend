import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
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

  async createProduk(data: any): Promise<Produk> {
    const { mitraId, harga, ...produkData } = data;
    
    // Check if mitraId is provided
    if (!mitraId) {
      throw new BadRequestException(`Invalid id:${mitraId} provided`); 
    }

    // Check if the mitra exists
    const existingMitra = await this.prisma.mitra.findUnique({
      where: { id: parseInt(mitraId) }
    });
    if (!existingMitra) {
      throw new NotFoundException(`Mitra with ID ${mitraId} not found.`);
    }

    return this.prisma.produk.create({
      data: {
        harga:parseInt(harga),
        ...produkData,
        mitra: {
          connect: { id: parseInt(mitraId) }
        }
      },
    });
  }

  async updateProduk(params: {
    id: number;
    data: Prisma.ProdukUpdateInput;
  }): Promise<Produk> {
    const { id, data } = params;
    if (!id) throw new BadRequestException(`Invalid id:${id} provided`);      
    const produkExist = await this.prisma.produk.findUnique({
      where: { id: id }
    });
    if (!produkExist) throw new NotFoundException(`Produk with ID ${id} not found.`);      
    return this.prisma.produk.update({
      data,
      where:{
        id: id
      },
    });
  }

  async deleteProduk(where: Prisma.ProdukWhereUniqueInput): Promise<Produk> {
    if (!where.id) throw new BadRequestException(`Invalid id:${where.id} provided`);      
    const produkExist = await this.prisma.produk.findUnique({
      where
    });
    if (!produkExist) throw new NotFoundException(`Produk with ID ${where.id} not found.`);  
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
