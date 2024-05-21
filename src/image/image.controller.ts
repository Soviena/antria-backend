import {
    Controller,
    Get,
    Header,
    Param,
    Post,
    Res,
    StreamableFile,
    UploadedFile,
    UseInterceptors,
  } from '@nestjs/common';
import { createReadStream } from 'fs';
import { ImageService } from './image.service';
import * as path from 'path';
import * as fs from 'fs';


  
  @Controller('image')
  export class ImageController {
    constructor(private readonly imgageService: ImageService) {}

    @Get(':filename')
    @Header('Content-Type', 'image')
    async getImage(@Param('filename') filename: string): Promise<StreamableFile> {
      const file = this.imgageService.getImage(filename);
      try {
        await fs.promises.access(file, fs.constants.F_OK); 
        return new StreamableFile(createReadStream(file));
      } catch (err) {        
        return;
      }
    }
  }