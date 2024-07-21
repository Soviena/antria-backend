import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, NotFoundException } from '@nestjs/common';
import { PesananService } from './pesanan.service';
import { Pesanan } from '@prisma/client';
import { ApiTags } from '@nestjs/swagger';
import { AntrianService } from 'src/antrian/antrian.service';
import { AuthGuard, MitraOnly } from 'src/auth/auth.guards';

@Controller('pesanan')
@ApiTags('pesanan')

export class PesananController {
  constructor
  (
    private pesananService: PesananService,
    private antrianService: AntrianService
  ) {}

  @Get()
  @UseGuards(AuthGuard)
  async findAll(): Promise<Pesanan[]> {
    return this.pesananService.pesanans({});
  }

  @Get(':invoice')
  @UseGuards(AuthGuard)
  async findOne(@Param('invoice') invoice: string): Promise<Pesanan> {
    return this.pesananService.pesanan({ invoice });
  }

  @Get('mitra/:mitraId')
  @UseGuards(AuthGuard)
  async findByMitra(@Param('mitraId') mitraId: string): Promise<Pesanan[]> {
    return this.pesananService.pesanansByMitraId(parseInt(mitraId,10));
  }

  @Get('pelanggan/:pelangganId')
  @UseGuards(AuthGuard)
  async findByPelanggan(@Param('pelangganId') pelangganId: string): Promise<Pesanan[]> {
    return this.pesananService.pesanansByPelangganId(parseInt(pelangganId,10));
  }

  @Get('pelanggan/:pelangganId/:status')
  @UseGuards(AuthGuard)
  async findByPelangganIfStatus(@Param('pelangganId') pelangganId: string, @Param('status') status: string, @Body() data: any): Promise<Pesanan[]> {
    return this.pesananService.pesanansByPelangganIdStatus(parseInt(pelangganId,10), status, data);
  }

  @Get('mitra/:mitraId/success')
  @UseGuards(AuthGuard)
  async findByMitraIfSuccess(@Param('mitraId') mitraId: string): Promise<Pesanan[]> {
    return this.pesananService.pesanansByMitraIdSuccess(parseInt(mitraId,10));
  }


  @Post()
  @UseGuards(AuthGuard)
  async create(@Body() data: any): Promise<Pesanan> {
    return this.pesananService.createPesanan(data);
  }


  @Put(':invoice')
  @UseGuards(AuthGuard)
  async update(@Param('invoice') invoice: string, @Body() data: Pesanan): Promise<Pesanan> {
    return this.pesananService.updatePesanan({
      where: { invoice },
      data,
    });
  }

  @Put(':invoice/success')
  @UseGuards(AuthGuard, MitraOnly)
  async setSuccess(@Param('invoice') invoice: string): Promise<any> {
    const p = await this.pesananService.pesanan({invoice})
    if (!p) {
      throw new NotFoundException(`Pesanan with Invoice ${invoice} not found.`);
    }
    const mitraid = p.mitraId
    const q = await this.antrianService.findAntriansByMitraId(mitraid, {statusOrder: "ALLDONE"})
    let waitTime = 0
    if (q.length != 0){
      for (let i = 0; i < q.length; i++) {
        const queue = q[i];
        waitTime += getDifferenceInMinutes(queue.created_at, queue.updated_at)
      }
      waitTime = Math.floor(waitTime/q.length)
    }else{
      waitTime = 10
    }
    const antrian = await this.antrianService.createAntrian({
      estimasi:waitTime,
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
  @UseGuards(AuthGuard)
  async setFailed(@Param('invoice') invoice: string): Promise<Pesanan> {
    return this.pesananService.updatePesanan({
      where: { invoice },
      data: {
        status:"FAILED"
      }
    });
  }

  @Put(':invoice/pending')
  @UseGuards(AuthGuard)
  async setPending(@Param('invoice') invoice: string): Promise<Pesanan> {
    return this.pesananService.updatePesanan({
      where: { invoice },
      data: {
        status:"PENDING"
      }
    });
  }

  @Delete(':invoice')
  @UseGuards(AuthGuard)
  async remove(@Param('invoice') invoice: string): Promise<Pesanan> {
    return this.pesananService.deletePesanan({ invoice });
  }
}

function getDifferenceInMinutes(date1: Date, date2: Date): number {
  const diffInMs = Math.abs(date2.getTime() - date1.getTime()); // Difference in milliseconds
  return Math.floor(diffInMs / (1000 * 60)); // Convert to minutes and round down
}

