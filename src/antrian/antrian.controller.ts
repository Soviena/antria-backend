import { Controller, Get, Post, Put, Delete, Param, Body } from '@nestjs/common';
import { AntrianService } from './antrian.service';
import { Antrian, Prisma } from '@prisma/client';
import { ApiTags } from '@nestjs/swagger';

@Controller('antrian')
@ApiTags('antrian')

export class AntrianController {
  constructor(private antrianService: AntrianService) {}

  @Post()
  async create(@Body() data: Prisma.AntrianCreateInput): Promise<Antrian> {
    return this.antrianService.createAntrian(data);
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Antrian | null> {
    return this.antrianService.findAntrianById(Number(id));
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() data: Prisma.AntrianUpdateInput): Promise<Antrian> {
    return this.antrianService.updateAntrian({
      where: { id: Number(id) },
      data,
    });
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<Antrian> {
    return this.antrianService.deleteAntrian({ id: Number(id) });
  }
}
