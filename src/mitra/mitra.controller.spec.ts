import { Test, TestingModule } from '@nestjs/testing';
import { MitraController } from './mitra.controller';
import { MitraService } from './mitra.service';
import { Mitra } from '@prisma/client';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

describe('MitraController', () => {
  let mitraController: MitraController;
  let mitraService: MitraService;

  const mockMitraService = {
    mitras: jest.fn(),
    mitra: jest.fn(),
    createMitra: jest.fn(),
    createMitraWithOwner: jest.fn(),
    updateMitra: jest.fn(),
    deleteMitra: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MitraController],
      providers: [
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn().mockReturnValue('mockedJwtToken'),
            verify: jest.fn(),
          },
        },
        { provide: MitraService, useValue: mockMitraService },
      ],
    }).compile();

    mitraController = module.get<MitraController>(MitraController);
    mitraService = module.get<MitraService>(MitraService);
  });

  it('should be defined', () => {
    expect(mitraController).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of mitras', async () => {
      const mitras: Mitra[] = [
        {
          id              : 1,
          nama_toko       : "test",
          deskripsi_toko  : "test",
          alamat          : "test",
          linkGmaps       : "link",
          hari_buka       : "wednesday",
          jam_buka        : "13:00",
          jam_tutup       : "17:00",
          gambar_toko     : "file.jpg",
          subscription    : false,
          status_toko     : "OPEN",
          created_at      : new Date(2024, 6, 21, 12, 0, 0),
          updated_at      : new Date(2024, 6, 21, 12, 0, 0)
        },
        {
          id              : 2,
          nama_toko       : "test2",
          deskripsi_toko  : "test2",
          alamat          : "test2",
          linkGmaps       : "link",
          hari_buka       : "wednesday",
          jam_buka        : "13:00",
          jam_tutup       : "17:00",
          gambar_toko     : "file.jpg",
          subscription    : false,
          status_toko     : "OPEN",
          created_at      : new Date(2024, 6, 21, 12, 0, 0),
          updated_at      : new Date(2024, 6, 21, 12, 0, 0)
        }, 
      ];
      jest.spyOn(mitraService, 'mitras').mockResolvedValue(mitras);

      expect(await mitraController.findAll()).toBe(mitras);
    });
  });

  describe('findOne', () => {
    it('should return a single mitra', async () => {
      const mitra: Mitra = {
        id              : 1,
        nama_toko       : "test",
        deskripsi_toko  : "test",
        alamat          : "test",
        linkGmaps       : "link",
        hari_buka       : "wednesday",
        jam_buka        : "13:00",
        jam_tutup       : "17:00",
        gambar_toko     : "file.jpg",
        subscription    : false,
        status_toko     : "OPEN",
        created_at      : new Date(2024, 6, 21, 12, 0, 0),
        updated_at      : new Date(2024, 6, 21, 12, 0, 0)
      };
      jest.spyOn(mitraService, 'mitra').mockResolvedValue(mitra);

      expect(await mitraController.findOne('1')).toBe(mitra);
    });

    it('should throw NotFoundException if mitra is not found', async () => {
      jest.spyOn(mitraService, 'mitra').mockImplementation(async (data: any) => {
        throw new NotFoundException
        return data
      })
      await expect(mitraController.findOne('1')).rejects.toThrow(NotFoundException);
    });
  });

  describe('create', () => {
    it('should create and return a mitra', async () => {
      const mitraData: Mitra = {
        id              : 1,
        nama_toko       : "test",
        deskripsi_toko  : "test",
        alamat          : "test",
        linkGmaps       : "link",
        hari_buka       : "wednesday",
        jam_buka        : "13:00",
        jam_tutup       : "17:00",
        gambar_toko     : "file.jpg",
        subscription    : false,
        status_toko     : "OPEN",
        created_at      : new Date(2024, 6, 21, 12, 0, 0),
        updated_at      : new Date(2024, 6, 21, 12, 0, 0)
      };
      jest.spyOn(mitraService, 'createMitra').mockResolvedValue(mitraData);

      expect(await mitraController.create(mitraData)).toBe(mitraData);
    });
  });

  describe('createWithOwner', () => {
    it('should create mitra with owner and return data', async () => {
      const mitraData = { name: 'Test Mitra' };
      const karyawanData = { username: 'owner', password: 'password' };
      const result = { mitra: mitraData, karyawan: { ...karyawanData, password: 'hashedpassword' } };

      jest.spyOn(bcrypt, 'hash').mockImplementation(async (pass:string, hash:number) => {
        return "lasdkhwegpih"
      })
      jest.spyOn(mitraService, 'createMitraWithOwner').mockResolvedValue(result);

      expect(await mitraController.createWithOwner({ mitraData, karyawanData })).toBe(result);
    });
  });

  describe('update', () => {
    it('should update and return a mitra with new file name', async () => {
      const mitraData: Mitra = {
        id              : 1,
        nama_toko       : "test",
        deskripsi_toko  : "test",
        alamat          : "test",
        linkGmaps       : "link",
        hari_buka       : "wednesday",
        jam_buka        : "13:00",
        jam_tutup       : "17:00",
        gambar_toko     : "file.jpg",
        subscription    : false,
        status_toko     : "OPEN",
        created_at      : new Date(2024, 6, 21, 12, 0, 0),
        updated_at      : new Date(2024, 6, 21, 12, 0, 0)
      };
      const file = { filename: 'newfile.jpg' } as Express.Multer.File;
      const updatedMitra: Mitra = {
        id              : 1,
        nama_toko       : "test",
        deskripsi_toko  : "test",
        alamat          : "test",
        linkGmaps       : "link",
        hari_buka       : "wednesday",
        jam_buka        : "13:00",
        jam_tutup       : "17:00",
        gambar_toko     : "file.jpg",
        subscription    : false,
        status_toko     : "OPEN",
        created_at      : new Date(2024, 6, 21, 12, 0, 0),
        updated_at      : new Date(2024, 6, 21, 12, 0, 0)
      };

      jest.spyOn(mitraService, 'updateMitra').mockResolvedValue(updatedMitra);

      expect(await mitraController.update('1', mitraData, file)).toBe(updatedMitra);
    });
  });

  describe('remove', () => {
    it('should delete and return a mitra', async () => {
      const mitra: Mitra = {
        id              : 1,
        nama_toko       : "test",
        deskripsi_toko  : "test",
        alamat          : "test",
        linkGmaps       : "link",
        hari_buka       : "wednesday",
        jam_buka        : "13:00",
        jam_tutup       : "17:00",
        gambar_toko     : "file.jpg",
        subscription    : false,
        status_toko     : "OPEN",
        created_at      : new Date(2024, 6, 21, 12, 0, 0),
        updated_at      : new Date(2024, 6, 21, 12, 0, 0)
      };
      jest.spyOn(mitraService, 'deleteMitra').mockResolvedValue(mitra);

      expect(await mitraController.remove('1')).toBe(mitra);
    });
  });
});
