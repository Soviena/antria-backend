import { Module } from '@nestjs/common';
import { ProdukService } from './produk.service';
import { ProdukController } from './produk.controller';
import { PrismaService } from 'src/prisma.service';


@Module({
  providers: [ProdukService,PrismaService],
  controllers: [ProdukController],
  exports:[ProdukService]
})
export class ProdukModule {}
