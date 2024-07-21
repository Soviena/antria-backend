import { Test, TestingModule } from '@nestjs/testing';
import { KaryawanService } from './karyawan.service';
import { PrismaService } from '../prisma.service';
import { Karyawan, Prisma } from '@prisma/client';
import { NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';


describe('KaryawanService', () => {
  let karyawanService: KaryawanService;
  let prismaService: PrismaService;

  const mockPrismaService = {
    karyawan: {
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
        KaryawanService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    karyawanService = module.get<KaryawanService>(KaryawanService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(karyawanService).toBeDefined();
  });

  describe('karyawan', () => {
    it('should return a single karyawan', async () => {
      const karyawan: Karyawan = { 
        id: 1,
        username: 'test',
        password: "$asd$Sadljk4;kldfhp",
        profile_picture: 'profile.jpg',
        email: 'test@example.com',
        nama: "tester",
        handphone:"0822816594",
        alamat:"test",
        mitraId:1,
        isOwner:false,
        created_at: new Date(2024, 6, 21, 12, 0, 0),
        updated_at: new Date(2024, 6, 21, 12, 0, 0),
       };
      jest.spyOn(prismaService.karyawan, 'findUnique').mockResolvedValue(karyawan);

      expect(await karyawanService.karyawan({ id: 1 })).toBe(karyawan);
    });

    it('should return null if karyawan not found', async () => {
      jest.spyOn(prismaService.karyawan, 'findUnique').mockResolvedValue(null);

      expect(await karyawanService.karyawan({ id: 1 })).toBe(null);
    });
  });

  describe('karyawans', () => {
    it('should return an array of karyawans', async () => {
      const karyawans: Karyawan[] = [
        {
          id: 1,
          username: 'test',
          password: "$asd$Sadljk4;kldfhp",
          profile_picture: 'profile.jpg',
          email: 'test@example.com',
          nama: "tester",
          handphone:"0822816594",
          alamat:"test",
          mitraId:1,
          isOwner:false,
          created_at: new Date(2024, 6, 21, 12, 0, 0),
          updated_at: new Date(2024, 6, 21, 12, 0, 0),
        },
        {
          id: 2,
          username: 'test2',
          password: "$asd$Sadljk4;kldfhp",
          profile_picture: 'profile.jpg',
          email: 'test2@example.com',
          nama: "tester",
          handphone:"0822816594",
          alamat:"test2",
          mitraId:1,
          isOwner:false,
          created_at: new Date(2024, 6, 21, 12, 0, 0),
          updated_at: new Date(2024, 6, 21, 12, 0, 0),
        }
      ];
      jest.spyOn(prismaService.karyawan, 'findMany').mockResolvedValue(karyawans);

      expect(await karyawanService.karyawans({})).toBe(karyawans);
    });
  });

  describe('createKaryawan', () => {
    it('should create and return a karyawan', async () => {
      const karyawanData: Prisma.KaryawanCreateInput = { 
        username: 'test',
        password: "$asd$Sadljk4;kldfhp",
        profile_picture: 'profile.jpg',
        email: 'test@example.com',
        nama: "tester",
        handphone:"0822816594",
        alamat:"test",
        mitra: {connect: {id: 1}},
        isOwner:false,
        created_at: new Date(2024, 6, 21, 12, 0, 0),
        updated_at: new Date(2024, 6, 21, 12, 0, 0),
       };
      const karyawan: Karyawan = { 
        id: 1,
        username: 'test',
        password: "$asd$Sadljk4;kldfhp",
        profile_picture: 'profile.jpg',
        email: 'test@example.com',
        nama: "tester",
        handphone:"0822816594",
        alamat:"test",
        mitraId: 1,
        isOwner:false,
        created_at: new Date(2024, 6, 21, 12, 0, 0),
        updated_at: new Date(2024, 6, 21, 12, 0, 0),
       };

      jest.spyOn(prismaService.mitra, 'findUnique').mockResolvedValue({ id: 1 } as any);
      jest.spyOn(prismaService.karyawan, 'create').mockResolvedValue(karyawan);
      jest.spyOn(bcrypt, 'hash').mockImplementation(async (pass:string, salt:number) => {
        return "gbiasfbiasbf"
      });

      expect(await karyawanService.createKaryawan(karyawanData)).toBe(karyawan);
    });

    it('should throw NotFoundException if mitra not found', async () => {
      const karyawanData: Prisma.KaryawanCreateInput = { 
        username: 'test',
        password: "$asd$Sadljk4;kldfhp",
        profile_picture: 'profile.jpg',
        email: 'test@example.com',
        nama: "tester",
        handphone:"0822816594",
        alamat:"test",
        mitra: {connect: {id: 1}},
        isOwner:false,
        created_at: new Date(2024, 6, 21, 12, 0, 0),
        updated_at: new Date(2024, 6, 21, 12, 0, 0),
       };

      jest.spyOn(prismaService.mitra, 'findUnique').mockResolvedValue(null);

      await expect(karyawanService.createKaryawan(karyawanData)).rejects.toThrow(NotFoundException);
    });

    it('should throw Error if mitra ID is not provided', async () => {
      const karyawanData: Prisma.KaryawanCreateInput = { 
        username: 'test',
        password: "$asd$Sadljk4;kldfhp",
        profile_picture: 'profile.jpg',
        email: 'test@example.com',
        nama: "tester",
        handphone:"0822816594",
        alamat:"test",
        mitra: {},
        isOwner:false,
        created_at: new Date(2024, 6, 21, 12, 0, 0),
        updated_at: new Date(2024, 6, 21, 12, 0, 0),
       };

      await expect(karyawanService.createKaryawan(karyawanData)).rejects.toThrow(Error);
    });
  });

  describe('updateKaryawan', () => {
    it('should update and return the karyawan', async () => {
      const params = { where: { id: 1 }, data: { username: 'updated' } };
      const updatedKaryawan: Karyawan = { 
        id:1,
        username: 'updated',
        password: "$asd$Sadljk4;kldfhp",
        profile_picture: 'profile.jpg',
        email: 'test@example.com',
        nama: "tester",
        handphone:"0822816594",
        alamat:"test",
        mitraId: 1,
        isOwner:false,
        created_at: new Date(2024, 6, 21, 12, 0, 0),
        updated_at: new Date(2024, 6, 21, 12, 0, 0),
       };
      
      jest.spyOn(prismaService.karyawan, 'update').mockResolvedValue(updatedKaryawan);

      expect(await karyawanService.updateKaryawan(params)).toBe(updatedKaryawan);
    });
  });

  describe('deleteKaryawan', () => {
    it('should delete and return the karyawan', async () => {
      const karyawan: Karyawan = { 
        id:1,
        username: 'updated',
        password: "$asd$Sadljk4;kldfhp",
        profile_picture: 'profile.jpg',
        email: 'test@example.com',
        nama: "tester",
        handphone:"0822816594",
        alamat:"test",
        mitraId: 1,
        isOwner:false,
        created_at: new Date(2024, 6, 21, 12, 0, 0),
        updated_at: new Date(2024, 6, 21, 12, 0, 0),
       };
      jest.spyOn(prismaService.karyawan, 'delete').mockResolvedValue(karyawan);

      expect(await karyawanService.deleteKaryawan({ id: 1 })).toBe(karyawan);
    });
  });

  describe('karyawansByMitraId', () => {
    it('should return karyawans by mitraId', async () => {
      const karyawans: Karyawan[] = [
        {
          id: 1,
          username: 'test',
          password: "$asd$Sadljk4;kldfhp",
          profile_picture: 'profile.jpg',
          email: 'test@example.com',
          nama: "tester",
          handphone:"0822816594",
          alamat:"test",
          mitraId:1,
          isOwner:false,
          created_at: new Date(2024, 6, 21, 12, 0, 0),
          updated_at: new Date(2024, 6, 21, 12, 0, 0),
        },
        {
          id: 2,
          username: 'test2',
          password: "$asd$Sadljk4;kldfhp",
          profile_picture: 'profile.jpg',
          email: 'test2@example.com',
          nama: "tester",
          handphone:"0822816594",
          alamat:"test2",
          mitraId:1,
          isOwner:false,
          created_at: new Date(2024, 6, 21, 12, 0, 0),
          updated_at: new Date(2024, 6, 21, 12, 0, 0),
        }
      ];
      jest.spyOn(prismaService.karyawan, 'findMany').mockResolvedValue(karyawans);

      expect(await karyawanService.karyawansByMitraId(1)).toBe(karyawans);
    });
  });

  describe('findOne', () => {
    it('should return a karyawan if found', async () => {
      const karyawan: Karyawan = { 
        id: 2,
        username: 'test2',
        password: "$asd$Sadljk4;kldfhp",
        profile_picture: 'profile.jpg',
        email: 'test2@example.com',
        nama: "tester",
        handphone:"0822816594",
        alamat:"test2",
        mitraId:1,
        isOwner:false,
        created_at: new Date(2024, 6, 21, 12, 0, 0),
        updated_at: new Date(2024, 6, 21, 12, 0, 0),
       };
      jest.spyOn(karyawanService, 'karyawan').mockResolvedValue(karyawan);

      expect(await karyawanService.findOne('test')).toBe(karyawan);
    });

    it('should throw NotFoundException if karyawan not found', async () => {
      jest.spyOn(karyawanService, 'karyawan').mockResolvedValue(null);

      await expect(karyawanService.findOne('test')).rejects.toThrow(NotFoundException);
    });
  });
});
