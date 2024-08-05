import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { Pelanggan, Prisma } from '@prisma/client';

@Injectable()
export class PelangganService {
  constructor(private prisma: PrismaService) {}

  async pelanggan(
    pelangganWhereUniqueInput: Prisma.PelangganWhereUniqueInput,
  ): Promise<Pelanggan | null> {
    return this.prisma.pelanggan.findUnique({
      where: pelangganWhereUniqueInput,
    });
  }

  async pelanggans(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.PelangganWhereUniqueInput;
    where?: Prisma.PelangganWhereInput;
    orderBy?: Prisma.PelangganOrderByWithRelationInput;
  }): Promise<Pelanggan[]> {
    const { skip, take, cursor, where, orderBy } = params;
    return this.prisma.pelanggan.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
    });
  }



  async createPelanggan(data: Prisma.PelangganCreateInput): Promise<Pelanggan> {
    return this.prisma.pelanggan.create({
      data,
    });
  }

  async updatePelanggan(params: {
    where: Prisma.PelangganWhereUniqueInput;
    data: Prisma.PelangganUpdateInput;
  }): Promise<Pelanggan> {
    const { where, data } = params;
    return this.prisma.pelanggan.update({
      data,
      where,
    });
  }

  async deletePelanggan(where: Prisma.PelangganWhereUniqueInput): Promise<Pelanggan> {
    return this.prisma.pelanggan.delete({
      where,
    });
  }

  async findOne(username: string): Promise<Pelanggan> {
    const pelanggan = await this.pelanggan({ username });
    if (!pelanggan) {
      throw new NotFoundException(`Pelanggan with username ${username} not found.`);
    }
    return pelanggan;
  }

  async findOneEmail(email: string): Promise<Pelanggan> {
    const pelanggan = await this.pelanggan({ email:email });
    if (!pelanggan) {
      throw new NotFoundException(`Pelanggan with email ${email} not found.`);
    }
    return pelanggan;
  }
}
