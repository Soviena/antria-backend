import { ApiProperty } from '@nestjs/swagger';
export class CreatePelangganDto {
    @ApiProperty({ required: false })
    username: string;
  
    @ApiProperty({ required: false })
    password: string;
  
    @ApiProperty({ required: false })
    email: string;
  
    @ApiProperty({ required: false })
    nama: string;
  }