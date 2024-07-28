import { Test, TestingModule } from '@nestjs/testing';
import { AntrianService } from './antrian.service';
import { PrismaService } from '../prisma.service';
import { Antrian, Prisma } from '@prisma/client';

describe('AntrianService', () => {
  let service: AntrianService;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AntrianService,
        {
          provide: PrismaService,
          useValue: {
            antrian: {
              create: jest.fn(),
              findUnique: jest.fn(),
              update: jest.fn(),
              delete: jest.fn(),
              findMany: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    service = module.get<AntrianService>(AntrianService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createAntrian', () => {
    it('should create an antrian', async () => {
      const data = { pesananInvoice: 'INVC11223344', estimasi: 30 };
      const mockAntrian: Antrian = { id: 1, pesananId: 'INVC11223344', estimasi: 30, created_at: new Date() } as Antrian;
      jest.spyOn(prismaService.antrian, 'create').mockResolvedValue(mockAntrian);

      expect(await service.createAntrian(data)).toBe(mockAntrian);
    });
  });

  describe('findAntrianById', () => {
    it('should return an antrian by id', async () => {
      const mockAntrian: Antrian = { id: 1, pesananId: 'INVC11223344', estimasi: 30, created_at: new Date() } as Antrian;
      jest.spyOn(prismaService.antrian, 'findUnique').mockResolvedValue(mockAntrian);

      expect(await service.findAntrianById(1)).toBe(mockAntrian);
    });
  });

  describe('updateAntrian', () => {
    it('should update an antrian', async () => {
      const params = { where: { id: 1 }, data: { estimasi: 20 } };
      const mockAntrian: Antrian = { id: 1, pesananId: 'INVC11223344', estimasi: 20, created_at: new Date() } as Antrian;
      jest.spyOn(prismaService.antrian, 'update').mockResolvedValue(mockAntrian);

      expect(await service.updateAntrian(params)).toBe(mockAntrian);
    });
  });

  describe('deleteAntrian', () => {
    it('should delete an antrian', async () => {
      const mockAntrian: Antrian = { id: 1, pesananId: 'INVC11223344', estimasi: 30, created_at: new Date() } as Antrian;
      jest.spyOn(prismaService.antrian, 'delete').mockResolvedValue(mockAntrian);

      expect(await service.deleteAntrian({ id: 1 })).toBe(mockAntrian);
    });
  });

  describe('findAntriansByMitraId', () => {
    it('should return an array of antrians by mitra id', async () => {
      const mitraId = 1;
      const data = { limit: 2, statusOrder: 'PENDING', antrianId: 1 };
      const mockAntrians: Antrian[] = [
        { id: 1, pesananId: 'INVC11223344', estimasi: 30, created_at: new Date() } as Antrian,
        { id: 2, pesananId: 'INVC222334444', estimasi: 20, created_at: new Date() } as Antrian,
      ];
      jest.spyOn(prismaService.antrian, 'findMany').mockResolvedValue(mockAntrians);

      expect(await service.findAntriansByMitraId(mitraId, data)).toBe(mockAntrians);
    });
    it('should return an array of antrians by mitra id', async () => {
      const mitraId = 1;
      const data = { };
      const mockAntrians: Antrian[] = [
        { id: 1, pesananId: 'INVC11223344', estimasi: 30, created_at: new Date() } as Antrian,
        { id: 2, pesananId: 'INVC222334444', estimasi: 20, created_at: new Date() } as Antrian,
      ];
      jest.spyOn(prismaService.antrian, 'findMany').mockResolvedValue(mockAntrians);

      expect(await service.findAntriansByMitraId(mitraId, data)).toBe(mockAntrians);
    });
  });
});
