import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { KaryawanService } from './karyawan.service';
import { Karyawan } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { ApiTags } from '@nestjs/swagger';


@Controller('karyawan')
@ApiTags('karyawan')

export class KaryawanController {
  constructor(private karyawanService: KaryawanService) {}

  @Get()
  async findAll(): Promise<Karyawan[]> {
    return this.karyawanService.karyawans({});
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Karyawan> {
    return this.karyawanService.karyawan({ id: parseInt(id) });
  }

  @Post()
  async create(@Body() data: any): Promise<Karyawan> {
    const hashedPassword = await bcrypt.hash(data.password, 10);
    const karyawanData = { ...data, password: hashedPassword };
    return this.karyawanService.createKaryawan(karyawanData);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() data: Karyawan): Promise<Karyawan> {
    return this.karyawanService.updateKaryawan({
      where: { id: parseInt(id) },
      data,
    });
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<Karyawan> {
    return this.karyawanService.deleteKaryawan({ id: parseInt(id) });
  }

  @Get('mitra/:mitraId')
  async findByMitra(@Param('mitraId') mitraId: string): Promise<Karyawan[]> {
    return this.karyawanService.karyawansByMitraId(parseInt(mitraId, 10));
  }

}
