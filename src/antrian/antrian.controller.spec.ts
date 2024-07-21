import { Test, TestingModule } from '@nestjs/testing';
import { AntrianController } from './antrian.controller';
import { AntrianService } from './antrian.service';
import { Prisma, Antrian } from '@prisma/client';
import { AuthGuard, OwnerOnly } from 'src/auth/auth.guards';
import { ExecutionContext } from '@nestjs/common';
// import { getMockRes } from '@jest-mock/express';

// Mocking the AuthGuard and OwnerOnly guard
const mockAuthGuard = {
  canActivate: jest.fn((context: ExecutionContext) => true),
};

const mockOwnerOnlyGuard = {
  canActivate: jest.fn((context: ExecutionContext) => true),
};

describe('AntrianController', () => {
  let controller: AntrianController;
  let service: AntrianService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AntrianController],
      providers: [
        {
          provide: AntrianService,
          useValue: {
            createAntrian: jest.fn(),
            findAntrianById: jest.fn(),
            findAntriansByMitraId: jest.fn(),
            updateAntrian: jest.fn(),
            deleteAntrian: jest.fn(),
          },
        },
      ],
    })
      .overrideGuard(AuthGuard)
      .useValue(mockAuthGuard)
      .overrideGuard(OwnerOnly)
      .useValue(mockOwnerOnlyGuard)
      .compile();

    controller = module.get<AntrianController>(AntrianController);
    service = module.get<AntrianService>(AntrianService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findOne', () => {
    it('should return a single antrian', async () => {
      const result: Antrian = { id: 1, estimasi: 10, orderstatus: "ALLDONE", pesananId: "INVC3332221" } as Antrian;

      jest.spyOn(service, 'findAntrianById').mockResolvedValue(result);

      expect(await controller.findOne('1')).toBe(result);
    });
  });

  describe('findAntriansByMitraId', () => {
    it('should return an array of antrians', async () => {
      const result: Antrian[] = [{ id: 1, estimasi: 10, orderstatus: "ALLDONE", pesananId: "INVC3332221" }, { id: 2, estimasi: 20, orderstatus: "ALLDONE", pesananId: "INVC44334" }] as Antrian[];

      jest.spyOn(service, 'findAntriansByMitraId').mockResolvedValue(result);

      expect(await controller.findAntriansByMitraId('1', {})).toBe(result);
    });
  });

  describe('update', () => {
    it('should update an antrian', async () => {
      const antrianData: Prisma.AntrianUpdateInput = { estimasi: 20 };
      const result: Antrian = { id: 1, estimasi: 20, orderstatus: "ALLDONE", pesananId: "INVC3332221" } as Antrian;

      jest.spyOn(service, 'updateAntrian').mockResolvedValue(result);

      expect(await controller.update('1', antrianData)).toBe(result);
    });
  });

  describe('remove', () => {
    it('should remove an antrian', async () => {
      const result: Antrian = { id: 1, estimasi: 20, orderstatus: "ALLDONE", pesananId: "INVC3332221" } as Antrian;

      jest.spyOn(service, 'deleteAntrian').mockResolvedValue(result);

      expect(await controller.remove('1')).toBe(result);
    });
  });
});
