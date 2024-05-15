import { Module } from '@nestjs/common';
import { PelangganController } from './pelangganController';
import { PelangganService } from './pelanggan.service';
import { PrismaService } from 'src/prisma.service';

@Module({
    controllers: [PelangganController],
    providers: [PelangganService,PrismaService],
    exports:[PelangganService]
})
export class PelangganModule {}
