import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { PelangganService } from '../pelanggan/pelanggan.service';
import { KaryawanService } from 'src/karyawan/karyawan.service';
import { JwtService } from '@nestjs/jwt';
import { NotFoundException, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

describe('AuthService', () => {
  let authService: AuthService;
  let pelangganService: PelangganService;
  let karyawanService: KaryawanService;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: PelangganService,
          useValue: {
            findOne: jest.fn(),
          },
        },
        {
          provide: KaryawanService,
          useValue: {
            findOne: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: {
            signAsync: jest.fn(),
          },
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    pelangganService = module.get<PelangganService>(PelangganService);
    karyawanService = module.get<KaryawanService>(KaryawanService);
    jwtService = module.get<JwtService>(JwtService);
  });

  it('should be defined', () => {
    expect(authService).toBeDefined();
  });

  describe('signInPelanggan', () => {
    it('should return an access token if credentials are valid', async () => {
      const username = 'test';
      const password = 'password';
      const user = {
        id: 1,
        username: 'test',
        password: await bcrypt.hash(password, 10),
        profile_picture: 'profile.jpg',
        email: 'test@example.com',
        emailVerified: true,
        nama: "tester",
        handphone:"0822816594",
        alamat:"test",
        wallet:20000,
        created_at: new Date(2024, 6, 21, 12, 0, 0),
        updated_at: new Date(2024, 6, 21, 12, 0, 0),
      };
      const payload = {
        sub: user.id,
        username: user.username,
        role: 'pelanggan',
        picture: user.profile_picture,
        email: user.email,
      };
      jest.spyOn(pelangganService, 'findOne').mockResolvedValue(user);
      jest.spyOn(jwtService, 'signAsync').mockResolvedValue('mockedJwtToken');
      jest.spyOn(bcrypt, 'compare').mockImplementation(async (pass: string, userpass: string) => {
        return true
      });

      const result = await authService.signInPelanggan(username, password);
      expect(result).toEqual({ access_token: 'mockedJwtToken' });
      expect(pelangganService.findOne).toHaveBeenCalledWith(username);
      expect(jwtService.signAsync).toHaveBeenCalledWith(payload);
    });

    it('should throw NotFoundException if user is not found', async () => {
      const username = 'test';
      const password = 'password';
      jest.spyOn(pelangganService, 'findOne').mockResolvedValue(null);

      await expect(authService.signInPelanggan(username, password)).rejects.toThrow(NotFoundException);
      expect(pelangganService.findOne).toHaveBeenCalledWith(username);
    });

    it('should throw UnauthorizedException if password is incorrect', async () => {
      const username = 'test';
      const password = 'password1';
      const user = {
        id: 1,
        username: 'test',
        password: await bcrypt.hash(password, 10),
        profile_picture: 'profile.jpg',
        email: 'test@example.com',
        emailVerified: true,
        nama: "tester",
        handphone:"0822816594",
        alamat:"test",
        wallet:20000,
        created_at: new Date(2024, 6, 21, 12, 0, 0),
        updated_at: new Date(2024, 6, 21, 12, 0, 0),
      };
      jest.spyOn(pelangganService, 'findOne').mockResolvedValue(user);
      jest.spyOn(bcrypt, 'compare').mockImplementation(async (pass: string, userpass: string) => {
        return false

      });

      await expect(authService.signInPelanggan(username, password)).rejects.toThrow(UnauthorizedException);
      expect(pelangganService.findOne).toHaveBeenCalledWith(username);
    });
  });

  describe('signInMitra', () => {
    it('should return an access token if credentials are valid', async () => {
      const username = 'test';
      const password = 'password';
      const user = {
        id: 1,
        username: 'test',
        password: await bcrypt.hash(password, 10),
        profile_picture: 'profile.jpg',
        email: 'test@example.com',
        emailVerified: true,
        nama: "tester",
        handphone:"0822816594",
        alamat:"test",
        wallet:20000,
        mitraId:1,
        isOwner:true,
        created_at: new Date(2024, 6, 21, 12, 0, 0),
        updated_at: new Date(2024, 6, 21, 12, 0, 0),
      };
      const payload = {
        sub: user.id,
        username: user.username,
        role: 'karyawan',
        mitraId: user.mitraId,
        picture: user.profile_picture,
        email: user.email,
        isOwner: user.isOwner,
        admin: false,
      };
      jest.spyOn(karyawanService, 'findOne').mockResolvedValue(user);
      jest.spyOn(jwtService, 'signAsync').mockResolvedValue('mockedJwtToken');
      jest.spyOn(bcrypt, 'compare').mockImplementation(async (pass: string, userpass: string) => {
        return true
      });

      const result = await authService.signInMitra(username, password);
      expect(result).toEqual({ access_token: 'mockedJwtToken' });
      expect(karyawanService.findOne).toHaveBeenCalledWith(username);
      expect(jwtService.signAsync).toHaveBeenCalledWith(payload);
    });

    it('should throw NotFoundException if user is not found', async () => {
      const username = 'test';
      const password = 'password';
      jest.spyOn(karyawanService, 'findOne').mockResolvedValue(null);

      await expect(authService.signInMitra(username, password)).rejects.toThrow(NotFoundException);
      expect(karyawanService.findOne).toHaveBeenCalledWith(username);
    });

    it('should throw UnauthorizedException if password is incorrect', async () => {
      const username = 'test';
      const password = 'password1';
      const user = {
        id: 1,
        username: 'test',
        password: await bcrypt.hash(password, 10),
        profile_picture: 'profile.jpg',
        email: 'test@example.com',
        emailVerified: true,
        nama: "tester",
        handphone:"0822816594",
        alamat:"test",
        wallet:20000,
        mitraId:1,
        isOwner:true,
        created_at: new Date(2024, 6, 21, 12, 0, 0),
        updated_at: new Date(2024, 6, 21, 12, 0, 0),
      };
      jest.spyOn(karyawanService, 'findOne').mockResolvedValue(user);
      jest.spyOn(bcrypt, 'compare').mockImplementation(async (pass: string, userpass: string) => {
        return false

      });

      await expect(authService.signInMitra(username, password)).rejects.toThrow(UnauthorizedException);
      expect(karyawanService.findOne).toHaveBeenCalledWith(username);
    });
  });
});
