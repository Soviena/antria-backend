import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import MitraOnlyId, { AuthGuard, MitraOnly, OwnerOnly } from './auth.guards';
import { LoginPelangganDto } from './dto/loginPelanggan.dto';
import { LoginMitraDto } from './dto/loginMitra.dto';
import { ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { PelangganService } from 'src/pelanggan/pelanggan.service';
import { KaryawanService } from 'src/karyawan/karyawan.service';

describe('AuthController', () => {
  let authController: AuthController;
  let authService: AuthService;

  const mockPelangganService = {
    pelanggans: jest.fn(),
    pelanggan: jest.fn(),
    createPelanggan: jest.fn(),
    updatePelanggan: jest.fn(),
    deletePelanggan: jest.fn(),
  };

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
      controllers: [AuthController],
      providers: [
        AuthService,
        Reflector,
        { provide: PelangganService, useValue: mockPelangganService },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn().mockReturnValue('mockedJwtToken'),
            verify: jest.fn(),
          },
        },
        {
          provide: KaryawanService,
          useValue: mockKaryawanService,
        },
        {
          provide: AuthGuard,
          useValue: jest.fn().mockImplementation((context: ExecutionContext) => true),
        },
        {
          provide: MitraOnly,
          useValue: jest.fn().mockImplementation((context: ExecutionContext) => true),
        },
        {
          provide: MitraOnlyId,
          useValue: jest.fn().mockImplementation((context: ExecutionContext) => true),
        },
        {
          provide: OwnerOnly,
          useValue: jest.fn().mockImplementation((context: ExecutionContext) => true),
        },
      ],
    }).compile();

    authController = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(authController).toBeDefined();
  });

  describe('signInPelanggan', () => {
    it('should call signInPelanggan method of AuthService', async () => {
      const signInPelangganDto: LoginPelangganDto = { username: 'test', password: 'test' };
      const result = { accessToken: 'test' };
      jest.spyOn(authService, 'signInPelanggan').mockResolvedValue(result);

      expect(await authController.signInPelanggan(signInPelangganDto)).toBe(result);
      expect(authService.signInPelanggan).toHaveBeenCalledWith('test', 'test');
    });
  });

  describe('signInMitra', () => {
    it('should call signInMitra method of AuthService', async () => {
      const signInMitraDto: LoginMitraDto = { username: 'test', password: 'test' };
      const result = { accessToken: 'test' };
      jest.spyOn(authService, 'signInMitra').mockResolvedValue(result);

      expect(await authController.signInMitra(signInMitraDto)).toBe(result);
      expect(authService.signInMitra).toHaveBeenCalledWith('test', 'test');
    });
  });

  describe('getProfile', () => {
    it('should return user from request', () => {
      const req = { user: { id: 1, username: 'test' } };
      expect(authController.getProfile(req)).toBe(req.user);
    });
  });

  describe('getProfile2', () => {
    it('should return user from request', () => {
      const req = { user: { id: 1, username: 'test' } };
      expect(authController.getProfile2(req)).toBe(req.user);
    });
  });
});
