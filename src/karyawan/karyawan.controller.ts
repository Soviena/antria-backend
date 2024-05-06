import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { KaryawanService } from './karyawan.service';
import { Karyawan } from '@prisma/client';

@Controller('karyawan')
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
    return this.karyawanService.createKaryawan(data);
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
}
