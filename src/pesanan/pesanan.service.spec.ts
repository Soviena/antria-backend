import { Test, TestingModule } from '@nestjs/testing';
import { PesananService } from './pesanan.service';
import { PrismaService } from '../prisma.service';
import { OrderlistService } from 'src/orderlist/orderlist.service';
import { AntrianService } from 'src/antrian/antrian.service';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { OrderStatus, Pesanan } from '@prisma/client';

describe('PesananService', () => {
  let service: PesananService;
  let prisma: PrismaService;
  let orderListService: OrderlistService;
  let antrianService: AntrianService;

  const mockPrismaService = {
    pesanan: {
      findUnique: jest.fn(),
      findMany: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    
    mitra: {
      findUnique: jest.fn(),
    },
    pelanggan: {
      findUnique: jest.fn(),
    },
  };

  const mockOrderListService = {
    createOrderList: jest.fn(),
  };

  const mockAntrianService = {
    findAntriansByMitraId: jest.fn(),
    createAntrian: jest.fn(),
    findAntrianById: jest.fn(),
    updateAntrian: jest.fn(),
    deleteAntrian: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PesananService,
        { provide: PrismaService, useValue: mockPrismaService },
        { provide: OrderlistService, useValue: mockOrderListService },
        { provide: AntrianService, useValue: mockAntrianService },
      ],
    }).compile();

    service = module.get<PesananService>(PesananService);
    prisma = module.get<PrismaService>(PrismaService);
    orderListService = module.get<OrderlistService>(OrderlistService);
    antrianService = module.get<AntrianService>(AntrianService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('pesanan', () => {
    it('should return a single pesanan', async () => {
      const pesanan = { id: 1, invoice: 'INV123', mitraId: 1, pelangganId: 1, status: 'PENDING' };
      mockPrismaService.pesanan.findUnique.mockResolvedValue(pesanan);

      expect(await service.pesanan({ invoice: 'INV123' })).toBe(pesanan);
    });
  });

  describe('pesanans', () => {
    it('should return an array of pesanans', async () => {
      const pesanans = [{ id: 1, invoice: 'INV123', mitraId: 1, pelangganId: 1, status: 'PENDING' }];
      mockPrismaService.pesanan.findMany.mockResolvedValue(pesanans);

      expect(await service.pesanans({})).toBe(pesanans);
    });
  });

  describe('createPesanan', () => {
    it('should throw BadRequestException if mitraId is missing', async () => {
      const data = { order_lists: [], pesanan: { pelangganId: 1, status: 'PENDING' } };

      await expect(service.createPesanan(data)).rejects.toThrow(BadRequestException);
    });

    it('should throw BadRequestException if pelangganId is missing for non-OFFLINE orders', async () => {
      const data = { order_lists: [], pesanan: { mitraId: 1, pemesanan: 'ONLINE', status: 'PENDING' } };

      await expect(service.createPesanan(data)).rejects.toThrow(BadRequestException);
    });

    it('should throw NotFoundException if mitra is not found', async () => {
      const data = { order_lists: [], pesanan: { mitraId: 1, pelangganId: 1, status: 'PENDING' } };
      mockPrismaService.mitra.findUnique.mockResolvedValue(null);

      await expect(service.createPesanan(data)).rejects.toThrow(NotFoundException);
    });

    it('should throw NotFoundException if pelanggan is not found', async () => {
      const data = { order_lists: [], pesanan: { mitraId: 1, pelangganId: 1, status: 'PENDING' } };
      mockPrismaService.mitra.findUnique.mockResolvedValue({ id: 1 });
      mockPrismaService.pelanggan.findUnique.mockResolvedValue(null);

      await expect(service.createPesanan(data)).rejects.toThrow(NotFoundException);
    });

    it('should create a new pesanan and order lists', async () => {
      const data = {
        order_lists: [{ produkId: 1, quantity: 2 }],
        pesanan: { mitraId: 1, pelangganId: 0, status: 'SUCCESS', pemesanan: 'OFFLINE'},
      };
      const pesanan = { id: 1, invoice: 'INV123', mitraId: 1, pelangganId: 0, status: 'SUCCESS', antrianId: 1 };
      const orderList = { id: 1, produkId: 1, quantity: 2, pesananId: 'INV123' };

      mockPrismaService.mitra.findUnique.mockResolvedValue({ id: 1, nama_toko: 'Toko' });
      mockPrismaService.pelanggan.findUnique.mockResolvedValue({ id: 1, nama: 'Customer' });
      mockPrismaService.pesanan.create.mockResolvedValue(pesanan);
      mockAntrianService.findAntriansByMitraId.mockResolvedValue([
        { id: 1, pesananId: 'INVC11223344', orderstatus: "ALLDONE", estimasi: 5, created_at: new Date(2024, 6, 21, 12, 0, 0), updated_at: new Date(2024, 6, 21, 12, 5, 0)},
        { id: 2, pesananId: 'INVC11223346', orderstatus: "ALLDONE", estimasi: 5, created_at: new Date(2024, 6, 21, 12, 0, 0), updated_at: new Date(2024, 6, 21, 12, 6, 0)},
        { id: 3, pesananId: 'INVC112233s6', orderstatus: "ALLDONE", estimasi: 5, created_at: new Date(2024, 6, 21, 12, 0, 0), updated_at: new Date(2024, 6, 21, 12, 7, 0)}
      ])
      mockOrderListService.createOrderList.mockResolvedValue(orderList);
      mockAntrianService.createAntrian.mockResolvedValue(pesanan)
      mockPrismaService.pesanan.update.mockResolvedValue(pesanan)

      const result = await service.createPesanan(data);

      expect(result.pesanan).toBe(pesanan);
      expect(result.orderlists).toEqual([orderList]);
    });

    it('should create a new pesanan and order lists', async () => {
      const data = {
        order_lists: [{ produkId: 1, quantity: 2 }],
        pesanan: { mitraId: 1, pelangganId: 1, status: 'PENDING', pemesanan: 'ONLINE'},
      };
      const pesanan = { id: 1, invoice: 'INV123', mitraId: 1, pelangganId: 1, status: 'PENDING', antrianId: 1 };
      const orderList = { id: 1, produkId: 1, quantity: 2, pesananId: 'INV123' };

      mockPrismaService.mitra.findUnique.mockResolvedValue({ id: 1, nama_toko: 'Toko' });
      mockPrismaService.pelanggan.findUnique.mockResolvedValue({ id: 1, nama: 'Customer' });
      mockPrismaService.pesanan.create.mockResolvedValue(pesanan);
      mockAntrianService.findAntriansByMitraId.mockResolvedValue([])
      mockOrderListService.createOrderList.mockResolvedValue(orderList);
      mockAntrianService.createAntrian.mockResolvedValue(pesanan)
      mockPrismaService.pesanan.update.mockResolvedValue(pesanan)

      const result = await service.createPesanan(data);

      expect(result.pesanan).toBe(pesanan);
      expect(result.orderlists).toEqual([orderList]);
    });

    it('should create a new pesanan and order lists with empty antrian history', async () => {
      const data = {
        order_lists: [{ produkId: 1, quantity: 2 }],
        pesanan: { mitraId: 1, pelangganId: 1, status: 'SUCCESS', pemesanan: 'ONLINE'},
      };
      const pesanan = { id: 1, invoice: 'INV123', mitraId: 1, pelangganId: 1, status: 'SUCCESS', antrianId: 1 };
      const orderList = { id: 1, produkId: 1, quantity: 2, pesananId: 'INV123' };

      mockPrismaService.mitra.findUnique.mockResolvedValue({ id: 1, nama_toko: 'Toko' });
      mockPrismaService.pelanggan.findUnique.mockResolvedValue({ id: 1, nama: 'Customer' });
      mockPrismaService.pesanan.create.mockResolvedValue(pesanan);
      mockAntrianService.findAntriansByMitraId.mockResolvedValue([])
      mockOrderListService.createOrderList.mockResolvedValue(orderList);
      mockAntrianService.createAntrian.mockResolvedValue(pesanan)
      mockPrismaService.pesanan.update.mockResolvedValue(pesanan)

      const result = await service.createPesanan(data);

      expect(result.pesanan).toBe(pesanan);
      expect(result.orderlists).toEqual([orderList]);
    });
  });

  describe('updatePesanan', () => {
    it('should update an existing pesanan', async () => {
      const pesanan = { id: 1, invoice: 'INV123', mitraId: 1, pelangganId: 1, status: 'PENDING' };
      const updatedPesanan = { ...pesanan, status: 'SUCCESS' };

      mockPrismaService.pesanan.update.mockResolvedValue(updatedPesanan);

      expect(await service.updatePesanan({ where: { invoice: 'INV123' }, data: { status: 'SUCCESS' } })).toBe(updatedPesanan);
    });
  });

  describe('deletePesanan', () => {
    it('should delete an existing pesanan', async () => {
      const pesanan = { id: 1, invoice: 'INV123', mitraId: 1, pelangganId: 1, status: 'PENDING' };

      mockPrismaService.pesanan.delete.mockResolvedValue(pesanan);

      expect(await service.deletePesanan({ invoice: 'INV123' })).toBe(pesanan);
    });
  });

  describe('pesanansByMitraId', () => {
    it('should return an array of pesanans by mitra ID', async () => {
      const pesanans = [{ id: 1, invoice: 'INV123', mitraId: 1, pelangganId: 1, status: 'PENDING' }];

      mockPrismaService.pesanan.findMany.mockResolvedValue(pesanans);

      expect(await service.pesanansByMitraId(1)).toBe(pesanans);
    });
  });

  describe('pesanansByPelangganId', () => {
    it('should return an array of pesanans by pelanggan ID', async () => {
      const pesanans = [{ id: 1, invoice: 'INV123', mitraId: 1, pelangganId: 1, status: 'PENDING' }];

      mockPrismaService.pesanan.findMany.mockResolvedValue(pesanans);

      expect(await service.pesanansByPelangganId(1)).toBe(pesanans);
    });
  });

  describe('pesanansByPelangganIdStatus', () => {
    it('should return an array of pesanans by pelanggan ID and status', async () => {
      const pesanans = [{ id: 1, invoice: 'INV123', mitraId: 1, pelangganId: 1, status: 'PENDING' }];

      mockPrismaService.pesanan.findMany.mockResolvedValue(pesanans);

      expect(await service.pesanansByPelangganIdStatus(1, 'PENDING', {})).toBe(pesanans);
    });
    it('should return an array of pesanans by pelanggan ID and status', async () => {
      const pesanans = [{ id: 1, invoice: 'INV123', mitraId: 1, pelangganId: 1, status: 'SUCCESS' }];

      mockPrismaService.pesanan.findMany.mockResolvedValue(pesanans);

      expect(await service.pesanansByPelangganIdStatus(1, 'SUCCESS', {})).toBe(pesanans);
    });
    it('should return an array of pesanans by pelanggan ID and status', async () => {
      const pesanans = [{ id: 1, invoice: 'INV123', mitraId: 1, pelangganId: 1, status: 'FAILED' }];

      mockPrismaService.pesanan.findMany.mockResolvedValue(pesanans);

      expect(await service.pesanansByPelangganIdStatus(1, 'FAILED', {status_order:"ALLDONE"})).toBe(pesanans);
    });
  });

  describe('pesanansByMitraIdSuccess', () => {
    it('should return an array of successful pesanans by mitra ID', async () => {
      const pesanans = [{ id: 1, invoice: 'INV123', mitraId: 1, pelangganId: 1, status: 'SUCCESS' }];

      mockPrismaService.pesanan.findMany.mockResolvedValue(pesanans);

      expect(await service.pesanansByMitraIdSuccess(1)).toBe(pesanans);
    });
  });
});

function getDifferenceInMinutes(date1: Date, date2: Date): number {
  const diffInMs = Math.abs(date2.getTime() - date1.getTime()); // Difference in milliseconds
  return Math.floor(diffInMs / (1000 * 60)); // Convert to minutes and round down
}
