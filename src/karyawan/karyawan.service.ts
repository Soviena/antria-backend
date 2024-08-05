import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { Karyawan, Prisma } from '@prisma/client';
import * as bcrypt from 'bcrypt';


@Injectable()
export class KaryawanService {
  constructor(private prisma: PrismaService) {}

  async karyawan(
    karyawanWhereUniqueInput: Prisma.KaryawanWhereUniqueInput,
  ): Promise<Karyawan | null> {
    return this.prisma.karyawan.findUnique({
      where: karyawanWhereUniqueInput,
    });
  }

  async karyawans(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.KaryawanWhereUniqueInput;
    where?: Prisma.KaryawanWhereInput;
    orderBy?: Prisma.KaryawanOrderByWithRelationInput;
  }): Promise<Karyawan[]> {
    const { skip, take, cursor, where, orderBy } = params;
    return this.prisma.karyawan.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
    });
  }

  async createKaryawan(data: Prisma.KaryawanCreateInput): Promise<Karyawan> {
    const { mitra, ...karyawanData } = data;
    
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

    return this.prisma.karyawan.create({
      data: {
        ...karyawanData,
        mitra: {
          connect: { id: mitra.connect.id }
        }
      },
    });
  }

  async updateKaryawan(params: {
    where: Prisma.KaryawanWhereUniqueInput;
    data: Prisma.KaryawanUpdateInput;
  }): Promise<Karyawan> {
    const { where, data } = params;
    const { password, ...karyawanData } = data
    let hashedPassword 
    if (password) {
      hashedPassword = await bcrypt.hash(String(password), 10);
      return this.prisma.karyawan.update({
        data: {
          password: hashedPassword,
          ...karyawanData
        },
        where,
      });
    }else{
      return this.prisma.karyawan.update({
        data,
        where,
      });
    }
  }

  async deleteKaryawan(where: Prisma.KaryawanWhereUniqueInput): Promise<Karyawan> {
    return this.prisma.karyawan.delete({
      where,
    });
  }

  async karyawansByMitraId(mitraId: number): Promise<Karyawan[]> {
    return this.prisma.karyawan.findMany({
      where: {
        mitraId: mitraId,
      },
    });
  }

  async findOne(username: string): Promise<Karyawan> {
    const karyawan = await this.karyawan({ username });
    if (!karyawan) {
      throw new NotFoundException(`Karyawan with Username ${username} not found.`);
    }
    return karyawan;
  }
  async findOneEmail(email: string): Promise<Karyawan> {
    const karyawan = await this.karyawan({ email:email });
    if (!karyawan) {
      throw new NotFoundException(`Karyawan with Email ${email} not found.`);
    }
    return karyawan;
  }

}
