import { Test, TestingModule } from '@nestjs/testing';
import { MitraService } from './mitra.service';

describe('MitraService', () => {
  let service: MitraService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MitraService],
    }).compile();

    service = module.get<MitraService>(MitraService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
