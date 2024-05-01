import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { Mitra, Prisma } from '@prisma/client';

@Injectable()
export class MitraService {
  constructor(private prisma: PrismaService) {}

  async mitra(
    mitraWhereUniqueInput: Prisma.MitraWhereUniqueInput,
  ): Promise<Mitra | null> {
    return this.prisma.mitra.findUnique({
      where: mitraWhereUniqueInput,
    });
  }

  async mitras(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.MitraWhereUniqueInput;
    where?: Prisma.MitraWhereInput;
    orderBy?: Prisma.MitraOrderByWithRelationInput;
  }): Promise<Mitra[]> {
    const { skip, take, cursor, where, orderBy } = params;
    return this.prisma.mitra.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
    });
  }

  async createMitra(data: Prisma.MitraCreateInput): Promise<Mitra> {
    return this.prisma.mitra.create({
      data,
    });
  }

  async updateMitra(params: {
    where: Prisma.MitraWhereUniqueInput;
    data: Prisma.MitraUpdateInput;
  }): Promise<Mitra> {
    const { where, data } = params;
    return this.prisma.mitra.update({
      data,
      where,
    });
  }

  async deleteMitra(where: Prisma.MitraWhereUniqueInput): Promise<Mitra> {
    return this.prisma.mitra.delete({
      where,
    });
  }
}
