import {
    Controller,
    Get,
    Header,
    Param,
    Post,
    StreamableFile,
    UploadedFile,
    UseInterceptors,
  } from '@nestjs/common';
import { createReadStream } from 'fs';
import { ImageService } from './image.service';
  
  @Controller('image')
  export class ImageController {
    constructor(private readonly imgageService: ImageService) {}

    @Get(':filename')
    @Header('Content-Type', 'image')
    getImage(@Param('filename') filename: string): StreamableFile {
      const file = this.imgageService.getImage(filename);
      return new StreamableFile(createReadStream(file));
    }
  }