import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { MitraService } from './mitra.service';
import { Mitra } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { ApiTags } from '@nestjs/swagger';


@Controller('mitra')
@ApiTags('mitra')

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

  @Post('new')
  async createWithOwner(@Body() data:any): Promise<any>{
    let { mitraData, karyawanData} = data;
    const hashedPassword = await bcrypt.hash(karyawanData.password, 10);
    karyawanData = { ...karyawanData, password: hashedPassword };
    return this.mitraService.createMitraWithOwner({mitraData, karyawanData});
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