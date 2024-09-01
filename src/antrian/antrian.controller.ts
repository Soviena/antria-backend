import { Controller, Get, Put, Delete, Param, Body, UseGuards } from '@nestjs/common';
import { AntrianService } from './antrian.service';
import { Antrian, Prisma } from '@prisma/client';
import { ApiTags } from '@nestjs/swagger';
import { AuthGuard, OwnerOnly } from 'src/auth/auth.guards';

@Controller('antrian')
@ApiTags('antrian')

export class AntrianController {
  constructor(private antrianService: AntrianService) {}

  @Get(':id')
  @UseGuards(AuthGuard)
  async findOne(@Param('id') id: string): Promise<Antrian | null> {
    return this.antrianService.findAntrianById(Number(id));
  }

  @Get('mitra/:id')
  @UseGuards(AuthGuard)
  async findAntriansByMitraId(@Param('id') mitraId: string, @Body() data: any): Promise<Antrian[] | null> {    
    return this.antrianService.findAntriansByMitraId(Number(mitraId), data);
  }

  @Put(':id')
  @UseGuards(AuthGuard)
  async update(@Param('id') id: string, @Body() data: Prisma.AntrianUpdateInput): Promise<Antrian> {
    return this.antrianService.updateAntrian({
      where: { id: Number(id) },
      data,
    });
  }

  @Delete(':id')
  @UseGuards(AuthGuard,OwnerOnly)
  async remove(@Param('id') id: string): Promise<Antrian> {
    return this.antrianService.deleteAntrian({ id: Number(id) });
  }
}
