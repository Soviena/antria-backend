import { Controller, Get, Post, Put, Delete, Body, Param, UseInterceptors, UploadedFile } from '@nestjs/common';
import { PelangganService } from './pelanggan.service';
import { Pelanggan } from '@prisma/client';
import { ApiTags } from '@nestjs/swagger';
import { CreatePelangganDto } from './dto/createPelanggan.dto';
import * as bcrypt from 'bcrypt';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import * as path from 'path';
import { v4 as uuidv4 } from 'uuid';
// import * as fs from 'fs';



@Controller('pelanggan')
@ApiTags('pelanggan')
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
  async create(@Body() data: CreatePelangganDto): Promise<Pelanggan> {
    const hashedPassword = await bcrypt.hash(data.password, 10);
    const pelangganData = { ...data, password: hashedPassword };
    return this.pelangganService.createPelanggan(pelangganData);
  }

  @Put(':id')
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
  async update(@Param('id') id: string, @Body() data: Pelanggan, @UploadedFile() file: Express.Multer.File): Promise<Pelanggan> {
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
    return this.pelangganService.updatePelanggan({
      where: { id: parseInt(id) },
      data: {
        profile_picture,
        ...data
      },
    });
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<Pelanggan> {
    return this.pelangganService.deletePelanggan({ id: parseInt(id) });
  }
}
