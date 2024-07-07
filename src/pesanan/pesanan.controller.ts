import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { PesananService } from './pesanan.service';
import { Pesanan } from '@prisma/client';
import { ApiTags } from '@nestjs/swagger';
import { AntrianService } from 'src/antrian/antrian.service';

@Controller('pesanan')
@ApiTags('pesanan')

export class PesananController {
  constructor
  (
    private pesananService: PesananService,
    private antrianService: AntrianService
  ) {}

  @Get()
  async findAll(): Promise<Pesanan[]> {
    return this.pesananService.pesanans({});
  }

  @Get(':invoice')
  async findOne(@Param('invoice') invoice: string): Promise<Pesanan> {
    return this.pesananService.pesanan({ invoice });
  }

  @Get('mitra/:mitraId')
  async findByMitra(@Param('mitraId') mitraId: string): Promise<Pesanan[]> {
    return this.pesananService.pesanansByMitraId(parseInt(mitraId,10));
  }

  @Get('pelanggan/:pelangganId')
  async findByPelanggan(@Param('pelangganId') pelangganId: string): Promise<Pesanan[]> {
    return this.pesananService.pesanansByPelangganId(parseInt(pelangganId,10));
  }

  @Get('pelanggan/:pelangganId/:status')
  async findByPelangganIfStatus(@Param('pelangganId') pelangganId: string, @Param('status') status: string, @Body() data: any): Promise<Pesanan[]> {
    return this.pesananService.pesanansByPelangganIdStatus(parseInt(pelangganId,10), status, data);
  }

  @Get('mitra/:mitraId/success')
  async findByMitraIfSuccess(@Param('mitraId') mitraId: string): Promise<Pesanan[]> {
    return this.pesananService.pesanansByMitraIdSuccess(parseInt(mitraId,10));
  }


  @Post()
  async create(@Body() data: any): Promise<Pesanan> {
    return this.pesananService.createPesanan(data);
  }

  @Post('withOrderList')
  async createWithOrderList(@Body() data: any): Promise<Pesanan> {
    return this.pesananService.createPesananWithOrderList(data);
  }

  @Put(':invoice')
  async update(@Param('invoice') invoice: string, @Body() data: Pesanan): Promise<Pesanan> {
    return this.pesananService.updatePesanan({
      where: { invoice },
      data,
    });
  }

  @Put(':invoice/success')
  async setSuccess(@Param('invoice') invoice: string): Promise<any> {
    const antrian = await this.antrianService.createAntrian({
      estimasi:30,
      pesananInvoice:invoice
    });
    const pesanan = await this.pesananService.updatePesanan({
      where: { invoice },
      data: {
        status:"SUCCESS",
        antrianId: antrian.id
      }
    });
    return {antrian:antrian,pesanan:pesanan}
  }

  @Put(':invoice/failed')
  async setFailed(@Param('invoice') invoice: string): Promise<Pesanan> {
    return this.pesananService.updatePesanan({
      where: { invoice },
      data: {
        status:"FAILED"
      }
    });
  }

  @Put(':invoice/pending')
  async setPending(@Param('invoice') invoice: string): Promise<Pesanan> {
    return this.pesananService.updatePesanan({
      where: { invoice },
      data: {
        status:"PENDING"
      }
    });
  }

  @Delete(':invoice')
  async remove(@Param('invoice') invoice: string): Promise<Pesanan> {
    return this.pesananService.deletePesanan({ invoice });
  }
}
