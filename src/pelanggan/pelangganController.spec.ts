import { Test, TestingModule } from '@nestjs/testing';
import { PelangganController } from './pelangganController';
import { PelangganService } from './pelanggan.service';
import { Pelanggan } from '@prisma/client';
import { AuthGuard } from 'src/auth/auth.guards';
import { CreatePelangganDto } from './dto/createPelanggan.dto';
import * as bcrypt from 'bcrypt';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { v4 as uuidv4 } from 'uuid';
import * as path from 'path';
import { of } from 'rxjs';
import { JwtService } from '@nestjs/jwt';

describe('PelangganController', () => {
  let controller: PelangganController;
  let service: PelangganService;

  const mockPelangganService = {
    pelanggans: jest.fn(),
    pelanggan: jest.fn(),
    createPelanggan: jest.fn(),
    updatePelanggan: jest.fn(),
    deletePelanggan: jest.fn(),
  };

  const mockAuthGuard = {
    canActivate: jest.fn(() => true),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PelangganController],
      providers: [
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn().mockReturnValue('mockedJwtToken'),
            verify: jest.fn(),
          },
        },
        { provide: PelangganService, useValue: mockPelangganService },
        { provide: AuthGuard, useValue: mockAuthGuard },
      ],
    }).compile();

    controller = module.get<PelangganController>(PelangganController);
    service = module.get<PelangganService>(PelangganService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of pelanggans', async () => {
      const result: Pelanggan[] = [{
        id: 1, username: 'testuser', nama: 'Test User', email: 'test@example.com', handphone: '1234567890',
        password: '',
        emailVerified: false,
        profile_picture: '',
        alamat: '',
        wallet: 0,
        created_at: undefined,
        updated_at: undefined
      }];
      jest.spyOn(service, 'pelanggans').mockResolvedValue(result);

      expect(await controller.findAll()).toBe(result);
    });
  });

  describe('findOne', () => {
    it('should return a single pelanggan', async () => {
      const result: Pelanggan = {
        id: 1, username: 'testuser', nama: 'Test User', email: 'test@example.com', handphone: '1234567890',
        password: '',
        emailVerified: false,
        profile_picture: '',
        alamat: '',
        wallet: 0,
        created_at: undefined,
        updated_at: undefined
      };
      jest.spyOn(service, 'pelanggan').mockResolvedValue(result);

      expect(await controller.findOne('1')).toBe(result);
    });
  });

  describe('create', () => {
    it('should create a new pelanggan', async () => {
      const createPelangganDto: CreatePelangganDto = { username: 'newuser', nama: 'New User', email: 'new@example.com', password: 'password' };
      const result: Pelanggan = {
        id: 1, username: 'newuser', nama: 'New User', email: 'new@example.com', handphone: '1234567890', password: 'hashedpassword',
        emailVerified: false,
        profile_picture: '',
        alamat: '',
        wallet: 0,
        created_at: undefined,
        updated_at: undefined
      };

      jest.spyOn(bcrypt, 'hash').mockImplementation(async (pass:string, hash:number) => {
        return "hashedpassword"
      });
      jest.spyOn(service, 'createPelanggan').mockResolvedValue(result);

      expect(await controller.create(createPelangganDto)).toBe(result);
      expect(bcrypt.hash).toHaveBeenCalledWith(createPelangganDto.password, 10);
    });
  });

  describe('update', () => {
    it('should update an existing pelanggan', async () => {
      const updatePelangganDto: Pelanggan = {
        id: 1, username: 'updateduser', nama: 'Updated User', email: 'updated@example.com', handphone: '1234567890',
        password: '',
        emailVerified: false,
        profile_picture: '',
        alamat: '',
        wallet: 0,
        created_at: undefined,
        updated_at: undefined
      };
      const result: Pelanggan = { ...updatePelangganDto };

      jest.spyOn(service, 'updatePelanggan').mockResolvedValue(result);

      expect(await controller.update('1', updatePelangganDto, null)).toBe(result);
    });

    it('should update an existing pelanggan with a profile picture', async () => {
      const updatePelangganDto: Pelanggan = {
        id: 1, username: 'updateduser', nama: 'Updated User', email: 'updated@example.com', handphone: '1234567890',
        password: '',
        emailVerified: false,
        profile_picture: '',
        alamat: '',
        wallet: 0,
        created_at: undefined,
        updated_at: undefined
      };
      const result: Pelanggan = { ...updatePelangganDto, profile_picture: 'newfile.jpg' };
      const mockFile = { filename: 'newfile.jpg' };

      jest.spyOn(service, 'updatePelanggan').mockResolvedValue(result);

      expect(await controller.update('1', updatePelangganDto, mockFile as any)).toBe(result);
    });
  });

  // describe('remove', () => {
  //   it('should delete an existing pelanggan', async () => {
  //     const result: Pelanggan = { id: 1, username: 'deleteuser', nama: 'Delete User', email: 'delete@example.com', handphone: '1234567890' };
  //     jest.spyOn(service, 'deletePelanggan').mockResolvedValue(result);

  //     expect(await controller.remove('1')).toBe(result);
  //   });
  // });
});
