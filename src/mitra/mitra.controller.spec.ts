import { Test, TestingModule } from '@nestjs/testing';
import { MitraController } from './mitra.controller';

describe('MitraController', () => {
  let controller: MitraController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MitraController],
    }).compile();

    controller = module.get<MitraController>(MitraController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
