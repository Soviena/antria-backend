import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { PesananService } from './pesanan.service';
import { Pesanan } from '@prisma/client';

@Controller('pesanan')
export class PesananController {
  constructor(private pesananService: PesananService) {}

  @Get()
  async findAll(): Promise<Pesanan[]> {
    return this.pesananService.pesanans({});
  }

  @Get(':invoice')
  async findOne(@Param('invoice') invoice: string): Promise<Pesanan> {
    return this.pesananService.pesanan({ invoice });
  }

  @Post()
  async create(@Body() data: any): Promise<Pesanan> {
    return this.pesananService.createPesanan(data);
  }

  @Put(':invoice')
  async update(@Param('invoice') invoice: string, @Body() data: Pesanan): Promise<Pesanan> {
    return this.pesananService.updatePesanan({
      where: { invoice },
      data,
    });
  }

  @Delete(':invoice')
  async remove(@Param('invoice') invoice: string): Promise<Pesanan> {
    return this.pesananService.deletePesanan({ invoice });
  }
}
