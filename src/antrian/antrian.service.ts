import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { Antrian, Prisma } from '@prisma/client';

@Injectable()
export class AntrianService {
  constructor(private prisma: PrismaService) {}

  async createAntrian(data: any): Promise<Antrian> {
    const {pesananInvoice, estimasi} = data;
    return this.prisma.antrian.create({ data:{
      estimasi:estimasi,
      pesananId:pesananInvoice
    }});
  }

  async findAntrianById(id: number): Promise<Antrian | null> {
    return this.prisma.antrian.findUnique({ where: { id } });
  }

  async updateAntrian(params: {
    where: Prisma.AntrianWhereUniqueInput;
    data: Prisma.AntrianUpdateInput;
  }): Promise<Antrian> {
    const { where, data } = params;
    return this.prisma.antrian.update({ data, where });
  }

  async deleteAntrian(where: Prisma.AntrianWhereUniqueInput): Promise<Antrian> {
    return this.prisma.antrian.delete({ where });
  }

  async findAntriansByMitraId(mitraId: number): Promise<Antrian[]> {
    return this.prisma.antrian.findMany({
      where: {
        pesanan: {
          mitraId: mitraId
        },
      },
    });
  }

}
