import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { PelangganService } from './pelanggan.service';
import { Pelanggan } from '@prisma/client';
import * as bcrypt from 'bcrypt';

@Controller('pelanggan')
export class PelangganController {
  constructor(private pelangganService: PelangganService) {}

  @Get()
  async findAll(): Promise<Pelanggan[]> {
    return this.pelangganService.pelanggans({});
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Pelanggan> {
    return this.pelangganService.pelanggan({ id: parseInt(id) });
  }

  @Post()
  async create(@Body() data: Pelanggan): Promise<Pelanggan> {
    const hashedPassword = await bcrypt.hash(data.password, 10);
    const pelangganData = { ...data, password: hashedPassword };
    return this.pelangganService.createPelanggan(pelangganData);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() data: Pelanggan): Promise<Pelanggan> {
    return this.pelangganService.updatePelanggan({
      where: { id: parseInt(id) },
      data,
    });
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<Pelanggan> {
    return this.pelangganService.deletePelanggan({ id: parseInt(id) });
  }
}
