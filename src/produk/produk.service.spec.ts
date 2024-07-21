import { Test, TestingModule } from '@nestjs/testing';
import { ProdukService } from './produk.service';
import { PrismaService } from '../prisma.service';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Produk } from '@prisma/client';

describe('ProdukService', () => {
  let service: ProdukService;
  let prismaService: PrismaService;

  const mockPrismaService = {
    produk: {
      findUnique: jest.fn(),
      findMany: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    mitra: {
      findUnique: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProdukService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<ProdukService>(ProdukService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('produk', () => {
    it('should return a single produk', async () => {
      const produk = {
        nama_produk     :"produk1",
        deskripsi_produk:"produk dari merk",
        id              :1,
        harga           :15000,
        gambar          :"produk.jpg",
        kuantitas       :2,
        mitraId         :1,
        show_produk     :true,
        created_at      :new Date(2024, 6, 21, 12, 0, 0),
        updated_at      :new Date(2024, 6, 21, 12, 0, 0)
      };
      mockPrismaService.produk.findUnique.mockResolvedValue(produk);

      expect(await service.produk({ id: 1 })).toBe(produk);
    });

    it('should return null if produk not found', async () => {
      mockPrismaService.produk.findUnique.mockResolvedValue(null);

      expect(await service.produk({ id: 1 })).toBeNull();
    });
  });

  describe('produks', () => {
    it('should return an array of produks', async () => {
      const produkArray = [
        {
          nama_produk     :"produk1",
          deskripsi_produk:"produk dari merk",
          id              :1,
          harga           :15000,
          gambar          :"produk.jpg",
          kuantitas       :2,
          mitraId         :1,
          show_produk     :true,
          created_at      :new Date(2024, 6, 21, 12, 0, 0),
          updated_at      :new Date(2024, 6, 21, 12, 0, 0)
        },
        {
          nama_produk     :"produk2",
          deskripsi_produk:"produk dari merk",
          id              :2,
          harga           :15000,
          gambar          :"produk.jpg",
          kuantitas       :2,
          mitraId         :1,
          show_produk     :true,
          created_at      :new Date(2024, 6, 21, 12, 0, 0),
          updated_at      :new Date(2024, 6, 21, 12, 0, 0)
        }
      ];
      mockPrismaService.produk.findMany.mockResolvedValue(produkArray);

      expect(await service.produks({})).toBe(produkArray);
    });
  });

  describe('createProduk', () => {
    it('should create a new produk', async () => {
      const produk = {
        nama_produk     :"produk1",
        deskripsi_produk:"produk dari merk",
        id              :1,
        harga           :15000,
        gambar          :"produk.jpg",
        kuantitas       :2,
        mitraId         :1,
        show_produk     :true,
        created_at      :new Date(2024, 6, 21, 12, 0, 0),
        updated_at      :new Date(2024, 6, 21, 12, 0, 0)
      };
      const data = { nama: 'Produk A', mitraId: 1, harga: '1000' };
      const mitra = { id: 1, nama: 'Mitra A' };
      mockPrismaService.mitra.findUnique.mockResolvedValue(mitra);
      mockPrismaService.produk.create.mockResolvedValue(produk);

      expect(await service.createProduk(data)).toBe(produk);
    });

    it('should throw BadRequestException if mitraId is not provided', async () => {
      const data = { nama: 'Produk A', harga: '1000' };

      await expect(service.createProduk(data)).rejects.toThrow(BadRequestException);
    });

    it('should throw NotFoundException if mitra not found', async () => {
      const data = { nama: 'Produk A', mitraId: 1, harga: '1000' };
      mockPrismaService.mitra.findUnique.mockResolvedValue(null);

      await expect(service.createProduk(data)).rejects.toThrow(NotFoundException);
    });
  });

  describe('updateProduk', () => {
    it('should update an existing produk', async () => {
      const produk = {
        nama_produk     :"produk1",
        deskripsi_produk:"produk dari merk",
        id              :1,
        harga           :15000,
        gambar          :"produk.jpg",
        kuantitas       :2,
        mitraId         :1,
        show_produk     :true,
        created_at      :new Date(2024, 6, 21, 12, 0, 0),
        updated_at      :new Date(2024, 6, 21, 12, 0, 0)
      };
      const data = { nama_produk: 'Produk A' };
      mockPrismaService.produk.findUnique.mockResolvedValue(produk);
      mockPrismaService.produk.update.mockResolvedValue(produk);

      expect(await service.updateProduk({ id: 1, data })).toBe(produk);
    });

    it('should throw BadRequestException if id is not provided', async () => {
      const data = { nama_produk: 'Produk A' };

      await expect(service.updateProduk({ id: null, data })).rejects.toThrow(BadRequestException);
    });

    it('should throw NotFoundException if produk not found', async () => {
      const data = { nama_produk: 'Produk A' };
      mockPrismaService.produk.findUnique.mockResolvedValue(null);

      await expect(service.updateProduk({ id: 1, data })).rejects.toThrow(NotFoundException);
    });
  });

  describe('deleteProduk', () => {
    it('should delete an existing produk', async () => {
      const produk = {
        nama_produk     :"produk1",
        deskripsi_produk:"produk dari merk",
        id              :1,
        harga           :15000,
        gambar          :"produk.jpg",
        kuantitas       :2,
        mitraId         :1,
        show_produk     :true,
        created_at      :new Date(2024, 6, 21, 12, 0, 0),
        updated_at      :new Date(2024, 6, 21, 12, 0, 0)
      };
      mockPrismaService.produk.findUnique.mockResolvedValue(produk);
      mockPrismaService.produk.delete.mockResolvedValue(produk);

      expect(await service.deleteProduk({ id: 1 })).toBe(produk);
    });

    it('should throw BadRequestException if id is not provided', async () => {
      await expect(service.deleteProduk({ id: null })).rejects.toThrow(BadRequestException);
    });

    it('should throw NotFoundException if produk not found', async () => {
      mockPrismaService.produk.findUnique.mockResolvedValue(null);

      await expect(service.deleteProduk({ id: 1 })).rejects.toThrow(NotFoundException);
    });
  });

  describe('produksByMitraId', () => {
    it('should return an array of produks by mitra ID', async () => {
      const produkArray = [{ id: 1, nama_produk: 'Produk A' }] as Produk[];
      mockPrismaService.produk.findMany.mockResolvedValue(produkArray);

      expect(await service.produksByMitraId(1)).toBe(produkArray);
    });
  });
});
