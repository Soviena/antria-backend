import { Test, TestingModule } from '@nestjs/testing';
import { OrderlistService } from './orderlist.service';

describe('OrderlistService', () => {
  let service: OrderlistService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OrderlistService],
    }).compile();

    service = module.get<OrderlistService>(OrderlistService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
