import { Test, TestingModule } from '@nestjs/testing';
import { MitraService } from './mitra.service';
import { PrismaService } from '../prisma.service';
import { Mitra, Prisma } from '@prisma/client';
import { NotFoundException } from '@nestjs/common';

describe('MitraService', () => {
  let mitraService: MitraService;
  let prismaService: PrismaService;

  const mockPrismaService = {
    mitra: {
      findUnique: jest.fn(),
      findMany: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    karyawan: {
      create: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MitraService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    mitraService = module.get<MitraService>(MitraService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(mitraService).toBeDefined();
  });

  describe('mitra', () => {
    it('should return a mitra with average review', async () => {
      const mitra: Mitra & { review: { rating: number }[] } = {
        id: 1,
        name: 'Test Mitra',
        review: [{ rating: 4 }, { rating: 5 }],
      } as any;

      jest.spyOn(prismaService.mitra, 'findUnique').mockResolvedValue(mitra);

      const result = await mitraService.mitra({ id: 1 });
      expect(result).toEqual({
        id: 1,
        name: 'Test Mitra',
        review: 5, // average of 4 and 5
      });
    });

    it('should return mitra with review empty array if no reviews exist', async () => {
      const mitra: Mitra & { review: { rating: number }[] } = {
        id: 1,
        name: 'Test Mitra',
        review: [],
      } as any;

      jest.spyOn(prismaService.mitra, 'findUnique').mockResolvedValue(mitra);

      const result = await mitraService.mitra({ id: 1 });
      expect(result).toEqual({
        id: 1,
        name: 'Test Mitra',
        review: NaN,
      });
    });
  });

  describe('mitras', () => {
    it('should return an array of mitras with average review', async () => {
      const mitras: (Mitra & { review: { rating: number }[] })[] = [
        { id: 1, name: 'Mitra 1', review: [{ rating: 4 }, { rating: 5 }] } as any,
        { id: 2, name: 'Mitra 2', review: [{ rating: 3 }] } as any,
      ];

      jest.spyOn(prismaService.mitra, 'findMany').mockResolvedValue(mitras);

      const result = await mitraService.mitras({});
      expect(result).toEqual([
        { id: 1, name: 'Mitra 1', review: 5 },
        { id: 2, name: 'Mitra 2', review: 3 },
      ]);
    });
  });

  describe('createMitra', () => {
    it('should create and return a mitra', async () => {
      const mitraData: Prisma.MitraCreateInput = { name: 'New Mitra' } as any;
      const createdMitra: Mitra = { id: 1, name: 'New Mitra' } as any;

      jest.spyOn(prismaService.mitra, 'create').mockResolvedValue(createdMitra);

      expect(await mitraService.createMitra(mitraData)).toBe(createdMitra);
    });
  });

  describe('updateMitra', () => {
    it('should update and return a mitra', async () => {
      const updateData: Prisma.MitraUpdateInput = { name: 'Updated Mitra' } as any;
      const updatedMitra: Mitra = { id: 1, name: 'Updated Mitra' } as any;

      jest.spyOn(prismaService.mitra, 'update').mockResolvedValue(updatedMitra);

      expect(await mitraService.updateMitra({ where: { id: 1 }, data: updateData })).toBe(updatedMitra);
    });
  });

  describe('deleteMitra', () => {
    it('should delete and return a mitra', async () => {
      const mitra: Mitra = { id: 1, name: 'Delete Me' } as any;

      jest.spyOn(prismaService.mitra, 'delete').mockResolvedValue(mitra);

      expect(await mitraService.deleteMitra({ id: 1 })).toBe(mitra);
    });
  });

  describe('createMitraWithOwner', () => {
    it('should create mitra and karyawan', async () => {
      const mitraData: Prisma.MitraCreateInput = { name: 'Mitra with Owner' } as any;
      const karyawanData: Prisma.KaryawanCreateInput = { username: 'owner', password: 'password' } as any;

      const mitra: Mitra = { id: 1, name: 'Mitra with Owner' } as any;
      const karyawan = { id: 1, username: 'owner' } as any;

      jest.spyOn(prismaService.mitra, 'create').mockResolvedValue(mitra);
      jest.spyOn(prismaService.karyawan, 'create').mockResolvedValue(karyawan);

      const result = await mitraService.createMitraWithOwner({ mitraData, karyawanData });
      expect(result).toEqual({ mitra, karyawan });
    });
  });
});
