import { Test, TestingModule } from '@nestjs/testing';
import { PesananController } from './pesanan.controller';
import { PesananService } from './pesanan.service';
import { AntrianService } from 'src/antrian/antrian.service';
import { OrderStatus, Pesanan } from '@prisma/client';
import { AuthGuard, MitraOnly } from 'src/auth/auth.guards';
import { NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

describe('PesananController', () => {
  let controller: PesananController;
  let pesananService: PesananService;
  let antrianService: AntrianService;

  const mockPesananService = {
    pesanans: jest.fn(),
    pesanan: jest.fn(),
    pesanansByMitraId: jest.fn(),
    pesanansByPelangganId: jest.fn(),
    pesanansByPelangganIdStatus: jest.fn(),
    pesanansByMitraIdSuccess: jest.fn(),
    createPesanan: jest.fn(),
    updatePesanan: jest.fn(),
    deletePesanan: jest.fn(),
  };

  const mockAntrianService = {
    findAntriansByMitraId: jest.fn(),
    createAntrian: jest.fn(),
  };

  const mockAuthGuard = {
    canActivate: jest.fn(() => true),
  };

  const mockMitraOnlyGuard = {
    canActivate: jest.fn(() => true),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PesananController],
      providers: [
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn().mockReturnValue('mockedJwtToken'),
            verify: jest.fn(),
          },
        },
        { provide: PesananService, useValue: mockPesananService },
        { provide: AntrianService, useValue: mockAntrianService },
        { provide: AuthGuard, useValue: mockAuthGuard },
        { provide: MitraOnly, useValue: mockMitraOnlyGuard },
      ],
    }).compile();

    controller = module.get<PesananController>(PesananController);
    pesananService = module.get<PesananService>(PesananService);
    antrianService = module.get<AntrianService>(AntrianService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of pesanans', async () => {
      const result: Pesanan[] = [{
        invoice: 'INV123',
        mitraId: 1,
        pelangganId: 1,
        status: 'PENDING',
        payment: 'EWALLET',
        pemesanan: 'ONLINE',
        takeaway: false,
        antrianId: 0,
        created_at: new Date(2024, 6, 21, 12, 0, 0),
        updated_at: new Date(2024, 6, 21, 12, 0, 0)
      }];
      jest.spyOn(pesananService, 'pesanans').mockResolvedValue(result);

      expect(await controller.findAll()).toBe(result);
    });
  });

  describe('findOne', () => {
    it('should return a single pesanan', async () => {
      const result: Pesanan = {
        invoice: 'INV123', mitraId: 1, pelangganId: 1, status: 'PENDING',
        payment: 'EWALLET',
        pemesanan: 'ONLINE',
        takeaway: false,
        antrianId: 0,
        created_at: new Date(2024, 6, 21, 12, 0, 0),
        updated_at: new Date(2024, 6, 21, 12, 0, 0)
      };
      jest.spyOn(pesananService, 'pesanan').mockResolvedValue(result);

      expect(await controller.findOne('INV123')).toBe(result);
    });
  });

  describe('findByMitra', () => {
    it('should return an array of pesanans by mitra ID', async () => {
      const result: Pesanan[] = [{
        invoice: 'INV123', mitraId: 1, pelangganId: 1, status: 'PENDING',
        payment: 'EWALLET',
        pemesanan: 'ONLINE',
        takeaway: false,
        antrianId: 0,
        created_at: new Date(2024, 6, 21, 12, 0, 0),
        updated_at: new Date(2024, 6, 21, 12, 0, 0)
      }];
      jest.spyOn(pesananService, 'pesanansByMitraId').mockResolvedValue(result);

      expect(await controller.findByMitra('1')).toBe(result);
    });
  });

  describe('findByPelanggan', () => {
    it('should return an array of pesanans by pelanggan ID', async () => {
      const result: Pesanan[] = [{
        invoice: 'INV123', mitraId: 1, pelangganId: 1, status: 'PENDING',
        payment: 'EWALLET',
        pemesanan: 'ONLINE',
        takeaway: false,
        antrianId: 0,
        created_at: new Date(2024, 6, 21, 12, 0, 0),
        updated_at: new Date(2024, 6, 21, 12, 0, 0)
      }];
      jest.spyOn(pesananService, 'pesanansByPelangganId').mockResolvedValue(result);

      expect(await controller.findByPelanggan('1')).toBe(result);
    });
  });

  describe('findByPelangganIfStatus', () => {
    it('should return an array of pesanans by pelanggan ID and status', async () => {
      const result: Pesanan[] = [{
        invoice: 'INV123', mitraId: 1, pelangganId: 1, status: 'PENDING',
        payment: 'EWALLET',
        pemesanan: 'ONLINE',
        takeaway: false,
        antrianId: 0,
        created_at: new Date(2024, 6, 21, 12, 0, 0),
        updated_at: new Date(2024, 6, 21, 12, 0, 0)
      }];
      const data = { someData: 'data' };
      jest.spyOn(pesananService, 'pesanansByPelangganIdStatus').mockResolvedValue(result);

      expect(await controller.findByPelangganIfStatus('1', 'PENDING', data)).toBe(result);
    });
  });

  describe('findByMitraIfSuccess', () => {
    it('should return an array of successful pesanans by mitra ID', async () => {
      const result: Pesanan[] = [{
        invoice: 'INV123', mitraId: 1, pelangganId: 1, status: 'SUCCESS',
        payment: 'EWALLET',
        pemesanan: 'ONLINE',
        takeaway: false,
        antrianId: 0,
        created_at: new Date(2024, 6, 21, 12, 0, 0),
        updated_at: new Date(2024, 6, 21, 12, 0, 0)
      }];
      jest.spyOn(pesananService, 'pesanansByMitraIdSuccess').mockResolvedValue(result);

      expect(await controller.findByMitraIfSuccess('1')).toBe(result);
    });
  });

  describe('create', () => {
    it('should create a new pesanan', async () => {
      const createPesananDto = { invoice: 'INV123', mitraId: 1, pelangganId: 1, status: 'PENDING' };
      const result: Pesanan = {
        invoice: 'INV123', mitraId: 1, pelangganId: 1, status: 'PENDING',
        payment: 'EWALLET',
        pemesanan: 'ONLINE',
        takeaway: false,
        antrianId: 0,
        created_at: new Date(2024, 6, 21, 12, 0, 0),
        updated_at: new Date(2024, 6, 21, 12, 0, 0)
      };

      jest.spyOn(pesananService, 'createPesanan').mockResolvedValue(result);

      expect(await controller.create(createPesananDto)).toBe(result);
    });
  });

  describe('update', () => {
    it('should update an existing pesanan', async () => {
      const updatePesananDto: Pesanan = {
        invoice: 'INV123', mitraId: 1, pelangganId: 1, status: 'PENDING',
        payment: 'EWALLET',
        pemesanan: 'ONLINE',
        takeaway: false,
        antrianId: 0,
        created_at: new Date(2024, 6, 21, 12, 0, 0),
        updated_at: new Date(2024, 6, 21, 12, 0, 0)
      };
      const result: Pesanan = { ...updatePesananDto };

      jest.spyOn(pesananService, 'updatePesanan').mockResolvedValue(result);

      expect(await controller.update('INV123', updatePesananDto)).toBe(result);
    });
  });

  describe('setSuccess', () => {
    it('should set the status of a pesanan to SUCCESS and create an antrian', async () => {
      const pesanan: Pesanan = {
        invoice: 'INV123', mitraId: 1, pelangganId: 1, status: 'PENDING',
        payment: 'EWALLET',
        pemesanan: 'ONLINE',
        takeaway: false,
        antrianId: 1,
        created_at: new Date(2024, 6, 21, 12, 0, 0),
        updated_at: new Date(2024, 6, 21, 12, 0, 0)
      };
      const antrian = {
        id: 1,
        estimasi: 10,
        orderstatus:"PROCESS" as OrderStatus,
        pesananId: 'INV123',
        created_at: new Date(2024, 6, 21, 12, 0, 0),
        updated_at: new Date(2024, 6, 21, 12, 0, 0)
      };
      const updatedPesanan: Pesanan = { ...pesanan, status: 'SUCCESS', antrianId: pesanan.antrianId };

      jest.spyOn(pesananService, 'pesanan').mockResolvedValue(pesanan);
      jest.spyOn(antrianService, 'findAntriansByMitraId').mockResolvedValue([]);
      jest.spyOn(antrianService, 'createAntrian').mockResolvedValue(antrian);
      jest.spyOn(pesananService, 'updatePesanan').mockResolvedValue(updatedPesanan);

      expect(await controller.setSuccess('INV123')).toEqual({ antrian, pesanan: updatedPesanan });
    });
    it('should set the status of a pesanan to SUCCESS and create an antrian', async () => {
      const pesanan: Pesanan = {
        invoice: 'INV123', mitraId: 1, pelangganId: 1, status: 'PENDING',
        payment: 'EWALLET',
        pemesanan: 'ONLINE',
        takeaway: false,
        antrianId: 1,
        created_at: new Date(2024, 6, 21, 12, 0, 0),
        updated_at: new Date(2024, 6, 21, 12, 0, 0)
      };
      const antrian = {
        id: 1,
        estimasi: 10,
        orderstatus:"PROCESS" as OrderStatus,
        pesananId: 'INV123',
        created_at: new Date(2024, 6, 21, 12, 0, 0),
        updated_at: new Date(2024, 6, 21, 12, 0, 0)
      };
      const updatedPesanan: Pesanan = { ...pesanan, status: 'SUCCESS', antrianId: pesanan.antrianId };

      jest.spyOn(pesananService, 'pesanan').mockResolvedValue(pesanan);
      jest.spyOn(antrianService, 'findAntriansByMitraId').mockResolvedValue([antrian]);
      jest.spyOn(antrianService, 'createAntrian').mockResolvedValue(antrian);
      jest.spyOn(pesananService, 'updatePesanan').mockResolvedValue(updatedPesanan);

      expect(await controller.setSuccess('INV123')).toEqual({ antrian, pesanan: updatedPesanan });
    });

    it('should throw NotFoundException if pesanan not found', async () => {
      jest.spyOn(pesananService, 'pesanan').mockResolvedValue(null);

      await expect(controller.setSuccess('INV123')).rejects.toThrow(NotFoundException);
    });
  });

  describe('setFailed', () => {
    it('should set the status of a pesanan to FAILED', async () => {
      const updatedPesanan: Pesanan = {
        invoice: 'INV123', mitraId: 1, pelangganId: 1, status: 'FAILED',
        payment: 'EWALLET',
        pemesanan: 'ONLINE',
        takeaway: false,
        antrianId: 0,
        created_at: new Date(2024, 6, 21, 12, 0, 0),
        updated_at: new Date(2024, 6, 21, 12, 0, 0)
      };

      jest.spyOn(pesananService, 'updatePesanan').mockResolvedValue(updatedPesanan);

      expect(await controller.setFailed('INV123')).toBe(updatedPesanan);
    });
  });

  describe('setPending', () => {
    it('should set the status of a pesanan to PENDING', async () => {
      const updatedPesanan: Pesanan = {
        invoice: 'INV123', mitraId: 1, pelangganId: 1, status: 'PENDING',
        payment: 'EWALLET',
        pemesanan: 'ONLINE',
        takeaway: false,
        antrianId: 0,
        created_at: new Date(2024, 6, 21, 12, 0, 0),
        updated_at: new Date(2024, 6, 21, 12, 0, 0)
      };

      jest.spyOn(pesananService, 'updatePesanan').mockResolvedValue(updatedPesanan);

      expect(await controller.setPending('INV123')).toBe(updatedPesanan);
    });
  });

  describe('remove', () => {
    it('should delete an existing pesanan', async () => {
      const result: Pesanan = {
        invoice: 'INV123', mitraId: 1, pelangganId: 1, status: 'PENDING',
        payment: 'EWALLET',
        pemesanan: 'ONLINE',
        takeaway: false,
        antrianId: 0,
        created_at: new Date(2024, 6, 21, 12, 0, 0),
        updated_at: new Date(2024, 6, 21, 12, 0, 0)
      };
      jest.spyOn(pesananService, 'deletePesanan').mockResolvedValue(result);

      expect(await controller.remove('INV123')).toBe(result);
    });
  });
});
