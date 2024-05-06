import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { ProdukService } from './produk.service';
import { Produk } from '@prisma/client';

@Controller('produk')
export class ProdukController {
  constructor(private produkService: ProdukService) {}

  @Get()
  async findAll(): Promise<Produk[]> {
    return this.produkService.produks({});
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Produk> {
    return this.produkService.produk({ id: parseInt(id) });
  }

  @Post()
  async create(@Body() data: any): Promise<Produk> {
    return this.produkService.createProduk(data);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() data: Produk): Promise<Produk> {
    return this.produkService.updateProduk({
      where: { id: parseInt(id) },
      data,
    });
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<Produk> {
    return this.produkService.deleteProduk({ id: parseInt(id) });
  }

  @Get('mitra/:mitraId')
  async findByMitra(@Param('mitraId') mitraId: string): Promise<Produk[]> {
    return this.produkService.produksByMitraId(parseInt(mitraId, 10));
  }
}
