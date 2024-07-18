import { Controller, Get, Post, Put, Delete, Body, Param, UseInterceptors, UploadedFile, UseGuards } from '@nestjs/common';
import { KaryawanService } from './karyawan.service';
import { Karyawan } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { v4 as uuidv4 } from 'uuid';
import * as path from 'path';
import MitraOnlyId, { AdminOnly, AuthGuard, MitraOnly, OwnerOnly } from 'src/auth/auth.guards';


@Controller('karyawan')
@ApiTags('karyawan')

export class KaryawanController {
  constructor(private karyawanService: KaryawanService) {}

  @Get()
  @UseGuards(AdminOnly)
  async findAll(): Promise<Karyawan[]> {
    return this.karyawanService.karyawans({});
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  async findOne(@Param('id') id: string): Promise<Karyawan> {
    return this.karyawanService.karyawan({ id: parseInt(id) });
  }

  @Post()
  @UseGuards(AuthGuard, MitraOnly, OwnerOnly)
  async create(@Body() data: any): Promise<Karyawan> {
    const hashedPassword = await bcrypt.hash(data.password, 10);
    const karyawanData = { ...data, password: hashedPassword };
    return this.karyawanService.createKaryawan(karyawanData);
  }

  @Put(':id')
  @UseGuards(AuthGuard)
  @UseInterceptors(FileInterceptor('profile_picture',{
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
  async update(@Param('id') id: string, @Body() data: Karyawan, @UploadedFile() file: Express.Multer.File): Promise<Karyawan> {
    let { profile_picture } = data;
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
      profile_picture = file.filename;
    }
    return this.karyawanService.updateKaryawan({
      where: { id: parseInt(id) },
      data: {
        profile_picture,
        ...data
      },
    });
  }

  @Delete(':id')
  @UseGuards(AdminOnly)
  async remove(@Param('id') id: string): Promise<Karyawan> {
    return this.karyawanService.deleteKaryawan({ id: parseInt(id) });
  }

  @Get('mitra/:mitraId')
  @UseGuards(AuthGuard, MitraOnly, MitraOnlyId('mitraId'), OwnerOnly)
  async findByMitra(@Param('mitraId') mitraId: string): Promise<Karyawan[]> {
    return this.karyawanService.karyawansByMitraId(parseInt(mitraId, 10));
  }

}
