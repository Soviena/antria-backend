import { Test, TestingModule } from '@nestjs/testing';
import { ProdukController } from './produk.controller';
import { ProdukService } from './produk.service';
import { Produk } from '@prisma/client';
import { AuthGuard, MitraOnly, OwnerOnly } from 'src/auth/auth.guards';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { v4 as uuidv4 } from 'uuid';
import * as path from 'path';
import { ExecutionContext } from '@nestjs/common';
import { of } from 'rxjs';
import { Reflector } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';

describe('ProdukController', () => {
  let controller: ProdukController;
  let service: ProdukService;

  const mockProdukService = {
    produks: jest.fn(),
    produk: jest.fn(),
    createProduk: jest.fn(),
    updateProduk: jest.fn(),
    deleteProduk: jest.fn(),
    produksByMitraId: jest.fn(),
  };

  const mockAuthGuard = {
    canActivate: jest.fn((context: ExecutionContext) => true),
  };

  const mockMitraOnlyGuard = {
    canActivate: jest.fn((context: ExecutionContext) => true),
  };

  const mockOwnerOnlyGuard = {
    canActivate: jest.fn((context: ExecutionContext) => true),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProdukController],
      providers: [
        { provide: ProdukService, useValue: mockProdukService },
        Reflector,
        ConfigService,
      ],
    })
      .overrideGuard(AuthGuard)
      .useValue(mockAuthGuard)
      .overrideGuard(MitraOnly)
      .useValue(mockMitraOnlyGuard)
      .overrideGuard(OwnerOnly)
      .useValue(mockOwnerOnlyGuard)
      .compile();

    controller = module.get<ProdukController>(ProdukController);
    service = module.get<ProdukService>(ProdukService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of produk', async () => {
      const produkArray = [{ id: 1, nama_produk: 'Produk A' }] as Produk[];
      mockProdukService.produks.mockResolvedValue(produkArray);

      expect(await controller.findAll()).toBe(produkArray);
    });
  });

  describe('findOne', () => {
    it('should return a single produk', async () => {
      const produk = { id: 1, nama_produk: 'Produk A' } as Produk;
      mockProdukService.produk.mockResolvedValue(produk);

      expect(await controller.findOne('1')).toBe(produk);
    });
  });

  describe('create', () => {
    it('should create a new produk', async () => {
      const file = {
        fieldname: "gambar",
        filename: 'test-file.png',
        mimetype: 'image/png',
        size: 1234,
      } as Express.Multer.File;
      const produk = { id: 1, nama_produk: 'Produk A',gambar:file.filename } as Produk;
      const data = { nama_produk: 'Produk A', gambar:file.filename };
      mockProdukService.createProduk.mockResolvedValue(produk);

      expect(await controller.create(data, file)).toBe(produk);
    });
  });

  describe('update', () => {
    it('should update an existing produk', async () => {
      const data = { nama_produk: 'Produk A' };
      const file = {
        fieldname: "gambar",
        filename: 'test-file.png',
        mimetype: 'image/png',
        size: 1234,
      } as Express.Multer.File;
      const produk = { id: 1, nama_produk: 'Produk A',gambar:file.filename } as Produk;
      mockProdukService.updateProduk.mockResolvedValue(produk);

      expect(await controller.update('1', data, file)).toBe(produk);
    });
  });

  describe('remove', () => {
    it('should delete an existing produk', async () => {
      const produk = { id: 1, nama_produk: 'Produk A' } as Produk;
      mockProdukService.deleteProduk.mockResolvedValue(produk);

      expect(await controller.remove('1')).toBe(produk);
    });
  });

  describe('findByMitra', () => {
    it('should return an array of produk by mitra ID', async () => {
      const produkArray = [{ id: 1, nama_produk: 'Produk A' }] as Produk[];
      mockProdukService.produksByMitraId.mockResolvedValue(produkArray);

      expect(await controller.findByMitra('1')).toBe(produkArray);
    });
  });
});
