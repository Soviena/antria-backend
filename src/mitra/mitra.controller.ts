import { Controller, Get, Post, Put, Delete, Body, Param, UseInterceptors, UploadedFile } from '@nestjs/common';
import { MitraService } from './mitra.service';
import { Mitra } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { v4 as uuidv4 } from 'uuid';
import * as path from 'path';


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
  @UseInterceptors(FileInterceptor('gambar_toko',{
    storage: diskStorage({
      destination: "./MediaUpload/",
      filename: (req, file, callback) => {
        const uniqueSuffix = uuidv4();
        const fileExtName = path.extname(file.originalname);
        const newFileName = `${uniqueSuffix}${fileExtName}`;
        callback(null, newFileName);
      }
    })
  }))
  async update(@Param('id') id: string, @Body() data: Mitra, @UploadedFile() file: Express.Multer.File): Promise<Mitra> {
    let { gambar_toko } = data;
    if (file != null) {
      // if (profile_picture !== "") {
      //   const filePath = __dirname+'../../MediaUpload/'+profile_picture;
      //   fs.unlink(filePath, (err) => {
      //     if (err) {
      //       console.error(err);
      //       return {
      //         status: 'error',
      //         message: 'File not found or could not be deleted',
      //       };
      //     }
      //     console.log(`File ${profile_picture} deleted`);
      //     return {
      //       status: 'success',
      //       message: `File ${profile_picture} deleted`,
      //     };
      //   });
      // }
      gambar_toko = file.filename;
    }
    return this.mitraService.updateMitra({
      where: { id: parseInt(id) },
      data: {
        gambar_toko: gambar_toko,
        ...data
      }
    });
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<Mitra> {
    return this.mitraService.deleteMitra({ id: parseInt(id) });
  }
}