import { Test, TestingModule } from '@nestjs/testing';
import { PelangganService } from './pelanggan.service';
import { PrismaService } from '../prisma.service';
import { Pelanggan } from '@prisma/client';
import { NotFoundException } from '@nestjs/common';

describe('PelangganService', () => {
  let service: PelangganService;
  let prisma: PrismaService;

  const mockPrismaService = {
    pelanggan: {
      findUnique: jest.fn(),
      findMany: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PelangganService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<PelangganService>(PelangganService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('pelanggan', () => {
    it('should return a pelanggan by unique input', async () => {
      const pelangganData: Pelanggan = {
        id: 1, username: 'testuser', nama: 'Test User', email: 'testuser@example.com', handphone: '1234567890',
        password: 'testPasswor',
        emailVerified: false,
        profile_picture: 'profile.jpg',
        alamat: 'testAddress',
        wallet: 0,
        created_at: new Date(2024, 6, 21, 12, 0, 0),
        updated_at: new Date(2024, 6, 21, 12, 0, 0)
      };
      jest.spyOn(prisma.pelanggan, 'findUnique').mockResolvedValue(pelangganData);

      expect(await service.pelanggan({ id: 1 })).toBe(pelangganData);
    });
  });

  describe('pelanggans', () => {
    it('should return a list of pelanggans', async () => {
      const pelanggansData: Pelanggan[] = [
        {
          id: 1, username: 'user1', nama: 'User One', email: 'user1@example.com', handphone: '1234567890',
          password: 'testPasswor',
          emailVerified: false,
          profile_picture: 'profile.jpg',
          alamat: 'testAddress',
          wallet: 0,
          created_at: new Date(2024, 6, 21, 12, 0, 0),
          updated_at: new Date(2024, 6, 21, 12, 0, 0)
        },
        {
          id: 2, username: 'user2', nama: 'User Two', email: 'user2@example.com', handphone: '0987654321',
          password: 'testPasswor',
          emailVerified: false,
          profile_picture: 'profile.jpg',
          alamat: 'testAddress',
          wallet: 0,
          created_at: new Date(2024, 6, 21, 12, 0, 0),
          updated_at: new Date(2024, 6, 21, 12, 0, 0)
        },
      ];
      jest.spyOn(prisma.pelanggan, 'findMany').mockResolvedValue(pelanggansData);

      expect(await service.pelanggans({})).toBe(pelanggansData);
    });
  });

  describe('createPelanggan', () => {
    it('should create and return a pelanggan', async () => {
      const pelangganData: Pelanggan = {
        id: 1, username: 'newuser', nama: 'New User', email: 'newuser@example.com', handphone: '1234567890',
        password: 'testPasswor',
        emailVerified: false,
        profile_picture: 'profile.jpg',
        alamat: 'testAddress',
        wallet: 0,
        created_at: new Date(2024, 6, 21, 12, 0, 0),
        updated_at: new Date(2024, 6, 21, 12, 0, 0)
      };
      jest.spyOn(prisma.pelanggan, 'create').mockResolvedValue(pelangganData);

      expect(await service.createPelanggan(pelangganData)).toBe(pelangganData);
    });
  });

  describe('updatePelanggan', () => {
    it('should update and return a pelanggan', async () => {
      const pelangganData: Pelanggan = {
        id: 1, username: 'updateduser', nama: 'Updated User', email: 'updateduser@example.com', handphone: '1234567890',
        password: 'testPasswor',
        emailVerified: false,
        profile_picture: 'profile.jpg',
        alamat: 'testAddress',
        wallet: 0,
        created_at: new Date(2024, 6, 21, 12, 0, 0),
        updated_at: new Date(2024, 6, 21, 12, 0, 0)
      };
      const updateData = { nama: 'Updated User' };
      jest.spyOn(prisma.pelanggan, 'update').mockResolvedValue(pelangganData);

      expect(await service.updatePelanggan({ where: { id: 1 }, data: updateData })).toBe(pelangganData);
    });
  });

  describe('deletePelanggan', () => {
    it('should delete and return a pelanggan', async () => {
      const pelangganData: Pelanggan = {
        id: 1, username: 'deleteuser', nama: 'Delete User', email: 'deleteuser@example.com', handphone: '1234567890',
        password: 'testPasswor',
        emailVerified: false,
        profile_picture: 'profile.jpg',
        alamat: 'testAddress',
        wallet: 0,
        created_at: new Date(2024, 6, 21, 12, 0, 0),
        updated_at: new Date(2024, 6, 21, 12, 0, 0)
      };
      jest.spyOn(prisma.pelanggan, 'delete').mockResolvedValue(pelangganData);

      expect(await service.deletePelanggan({ id: 1 })).toBe(pelangganData);
    });
  });

  describe('findOne', () => {
    it('should return a pelanggan by username', async () => {
      const pelangganData: Pelanggan = {
        id: 1, username: 'finduser', nama: 'Find User', email: 'finduser@example.com', handphone: '1234567890',
        password: 'testPasswor',
        emailVerified: false,
        profile_picture: 'profile.jpg',
        alamat: 'testAddress',
        wallet: 0,
        created_at: new Date(2024, 6, 21, 12, 0, 0),
        updated_at: new Date(2024, 6, 21, 12, 0, 0)
      };
      jest.spyOn(prisma.pelanggan, 'findUnique').mockResolvedValue(pelangganData);

      expect(await service.findOne('finduser')).toBe(pelangganData);
    });

    it('should throw a NotFoundException if pelanggan not found', async () => {
      jest.spyOn(prisma.pelanggan, 'findUnique').mockResolvedValue(null);

      await expect(service.findOne('unknownuser')).rejects.toThrow(NotFoundException);
    });
  });
});
