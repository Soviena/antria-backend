import { Test, TestingModule } from '@nestjs/testing';
import { KaryawanController } from './karyawan.controller';
import { KaryawanService } from './karyawan.service';
import { Karyawan } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { FileInterceptor } from '@nestjs/platform-express';
import { v4 as uuidv4 } from 'uuid';
import { diskStorage } from 'multer';
import * as path from 'path';
import { UnauthorizedException, NotFoundException, ExecutionContext } from '@nestjs/common';
import { AuthGuard, OwnerOnly } from 'src/auth/auth.guards';

const mockAuthGuard = {
  canActivate: jest.fn((context: ExecutionContext) => true),
};

const mockOwnerOnlyGuard = {
  canActivate: jest.fn((context: ExecutionContext) => true),
};

describe('KaryawanController', () => {
  let karyawanController: KaryawanController;
  let karyawanService: KaryawanService;

  const mockKaryawanService = {
    karyawans: jest.fn(),
    karyawan: jest.fn(),
    createKaryawan: jest.fn(),
    updateKaryawan: jest.fn(),
    deleteKaryawan: jest.fn(),
    karyawansByMitraId: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [KaryawanController],
      providers: [
        {
          provide: KaryawanService,
          useValue: mockKaryawanService,
        },
      ],
    })
    .overrideGuard(AuthGuard)
    .useValue(mockAuthGuard)
    .overrideGuard(OwnerOnly)
    .useValue(mockOwnerOnlyGuard)
    .compile();

    karyawanController = module.get<KaryawanController>(KaryawanController);
    karyawanService = module.get<KaryawanService>(KaryawanService);
  });

  it('should be defined', () => {
    expect(karyawanController).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of karyawans', async () => {
      const result: Karyawan[] = [
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
        },
      ];
      jest.spyOn(karyawanService, 'karyawans').mockResolvedValue(result);

      expect(await karyawanController.findAll()).toBe(result);
    });
  });

  describe('findOne', () => {
    it('should return a single karyawan', async () => {
      const id = '1';
      const result: Karyawan = { 
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
      jest.spyOn(karyawanService, 'karyawan').mockResolvedValue(result);

      expect(await karyawanController.findOne(id)).toBe(result);
    });

    it('should throw NotFoundException if karyawan is not found', async () => {
      const id = '1';
      jest.spyOn(karyawanService, 'karyawan').mockImplementation(async (data: any) => {
        throw new NotFoundException
        return data
      })
      await expect(karyawanController.findOne(id)).rejects.toThrow(NotFoundException);
    });
  });

  describe('create', () => {
    it('should create and return a new karyawan', async () => {
      const data = { 
        id: 1,
        username: 'test',
        password: "mypassword",
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
      const hashedPassword = await bcrypt.hash(data.password, 10);
      const result: Karyawan = { id: 1, ...data, password: hashedPassword };
      jest.spyOn(bcrypt, 'hash').mockImplementation(async (pass: string, hash: number) => {
        return "asdfgh345678dghjk"
      });
      jest.spyOn(karyawanService, 'createKaryawan').mockResolvedValue(result);

      expect(await karyawanController.create(data)).toBe(result);
    });
  });

  describe('update', () => {
    it('should update and return the karyawan', async () => {
      const id = '1';
      const data = {
        id:1,
        username: 'test2',
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
      const file = { filename: 'test-file.jpg' } as Express.Multer.File;
      const updatedData: Karyawan = { profile_picture: file.filename, ...data };
      jest.spyOn(karyawanService, 'updateKaryawan').mockResolvedValue(updatedData);

      expect(await karyawanController.update(id, data, file)).toBe(updatedData);
    });

    // Add other test cases for update if needed
  });

  describe('remove', () => {
    it('should delete and return the karyawan', async () => {
      const id = '1';
      const result: Karyawan = { 
        id:1,
        username: 'test2',
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
      jest.spyOn(karyawanService, 'deleteKaryawan').mockResolvedValue(result);

      expect(await karyawanController.remove(id)).toBe(result);
    });
  });

  describe('findByMitra', () => {
    it('should return an array of karyawans by mitraId', async () => {
      const mitraId = '1';
      const result: Karyawan[] = [
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
        },
      ];
      jest.spyOn(karyawanService, 'karyawansByMitraId').mockResolvedValue(result);

      expect(await karyawanController.findByMitra(mitraId)).toBe(result);
    });
  });
});
