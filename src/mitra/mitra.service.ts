import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { Mitra, Prisma } from '@prisma/client';

@Injectable()
export class MitraService {
  constructor(private prisma: PrismaService) {}

  async mitra(
    mitraWhereUniqueInput: Prisma.MitraWhereUniqueInput,
  ): Promise<Mitra | null> {
    let mitra = await this.prisma.mitra.findUnique({
      where: mitraWhereUniqueInput,
      include: {
        review: true,
      }
    });

    const { review, ...dataMitra } = mitra;
    let totalReview = 0;
    for (let index = 0; index < review.length; index++) {
      const element = review[index];
      totalReview += element.rating
    }
    const reviewAverage = Math.ceil(totalReview/review.length)
    let mitraWithReview = {
      review: reviewAverage,
      ...dataMitra
    }

    return mitraWithReview

  }

  async mitras(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.MitraWhereUniqueInput;
    where?: Prisma.MitraWhereInput;
    orderBy?: Prisma.MitraOrderByWithRelationInput;
  }): Promise<Mitra[]> {
    const { skip, take, cursor, where, orderBy } = params;
    let listmitra = await this.prisma.mitra.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
      include: {
        review: true
      }
    });
    let listMitraWithReview = [];
    for (let index = 0; index < listmitra.length; index++){ 
      const { review, ...dataMitra } = listmitra[index];
      let totalReview = 0;
      for (let index = 0; index < review.length; index++) {
        const element = review[index];
        totalReview += element.rating
      }
      const reviewAverage = Math.ceil(totalReview/review.length)
      let dataMitraWithReview = {
        review: reviewAverage,
        ...dataMitra
      }
      listMitraWithReview.push(dataMitraWithReview)
    }

    return listMitraWithReview
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

  async createMitraWithOwner(data: any): Promise<any> { 
    const { mitraData, karyawanData} = data;
    const mitra = await this.createMitra(mitraData);
    const karyawan = await this.prisma.karyawan.create({
      data: {
        ...karyawanData,
        mitra: {
          connect: { id: mitra.id }
        }
      }
    });
    return {mitra, karyawan};
  }
}
