import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { MitraService } from './mitra.service';
import { Mitra } from '@prisma/client';

@Controller('mitra')
export class MitraController {
  constructor(private mitraService: MitraService) {}

  @Get()
  async findAll(): Promise<Mitra[]> {
    return this.mitraService.mitras({});
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Mitra> {
    return this.mitraService.mitra({ id: parseInt(id) });
  }

  @Post()
  async create(@Body() data: Mitra): Promise<Mitra> {
    return this.mitraService.createMitra(data);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() data: Mitra): Promise<Mitra> {
    return this.mitraService.updateMitra({
      where: { id: parseInt(id) },
      data,
    });
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<Mitra> {
    return this.mitraService.deleteMitra({ id: parseInt(id) });
  }
}