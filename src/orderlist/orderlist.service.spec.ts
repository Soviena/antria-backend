import { Test, TestingModule } from '@nestjs/testing';
import { OrderlistService } from './orderlist.service';
import { PrismaService } from '../prisma.service';
import { OrderList } from '@prisma/client';

describe('OrderlistService', () => {
  let service: OrderlistService;
  let prisma: PrismaService;

  const mockPrismaService = {
    orderList: {
      create: jest.fn(),
      findUnique: jest.fn(),
      findMany: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      findFirst: jest.fn(),
      upsert: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrderlistService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<OrderlistService>(OrderlistService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createOrderList', () => {
    it('should create and return an order list', async () => {
      const orderListData = { produkId: 1, pesananId: 'INV001', quantity: 2, note: 'Test note' };
      const createdOrderList: OrderList = { id: 1, ...orderListData } as OrderList;

      jest.spyOn(prisma.orderList, 'findFirst').mockResolvedValue(null);
      jest.spyOn(prisma.orderList, 'upsert').mockResolvedValue(createdOrderList);

      expect(await service.createOrderList(orderListData)).toBe(createdOrderList);
    });
  });

  describe('getOrderListById', () => {
    it('should return an order list by ID', async () => {
      const orderListId = 1;
      const orderList: OrderList = { id: orderListId, produkId: 1, pesananId: 'INV001', quantity: 2, note: 'Test note' } as OrderList;

      jest.spyOn(prisma.orderList, 'findUnique').mockResolvedValue(orderList);

      expect(await service.getOrderListById(orderListId)).toBe(orderList);
    });
  });

  describe('getOrderListByInvoice', () => {
    it('should return all order lists by invoice', async () => {
      const invoice = 'INV001';
      const orders: OrderList[] = [
        { id: 1, produkId: 1, pesananId: invoice, quantity: 2, note: 'Test note' } as OrderList,
        { id: 2, produkId: 2, pesananId: invoice, quantity: 1, note: 'Test note 2' } as OrderList,
      ];

      jest.spyOn(prisma.orderList, 'findMany').mockResolvedValue(orders);

      expect(await service.getOrderListByInvoice(invoice)).toEqual(orders);
    });
  });

  describe('updateOrderList', () => {
    it('should update and return an order list', async () => {
      const orderListId = 1;
      const updateData = { quantity: 3, note: 'Updated note' };
      const updatedOrderList: OrderList = { id: orderListId, produkId: 1, pesananId: 'INV001', quantity: 3, note: 'Updated note' } as OrderList;

      jest.spyOn(prisma.orderList, 'update').mockResolvedValue(updatedOrderList);

      expect(await service.updateOrderList({ where: { id: orderListId }, data: updateData })).toBe(updatedOrderList);
    });
  });

  describe('deleteOrderList', () => {
    it('should delete and return an order list', async () => {
      const orderListId = 1;
      const deletedOrderList: OrderList = { id: orderListId, produkId: 1, pesananId: 'INV001', quantity: 2, note: 'Test note' } as OrderList;

      jest.spyOn(prisma.orderList, 'delete').mockResolvedValue(deletedOrderList);

      expect(await service.deleteOrderList({ id: orderListId })).toBe(deletedOrderList);
    });
  });

  describe('upsertOrderListWherePesananIdANDProdukIdIsTheSame', () => {
    it('should upsert and return an order list', async () => {
      const orderListData = { produkId: 1, pesananId: 'INV001', quantity: 2, note: 'Test note',pesanan:{}, produk:{}  };
      const existingOrderList: OrderList = { id: 1, produkId: 1, pesananId: 'INV001', quantity: 1, note: 'Existing note' } as OrderList;
      const upsertedOrderList: OrderList = { id: 1, ...orderListData } as OrderList;

      jest.spyOn(prisma.orderList, 'findFirst').mockResolvedValue(existingOrderList);
      jest.spyOn(prisma.orderList, 'upsert').mockResolvedValue(upsertedOrderList);

      expect(await service.upsertOrderListWherePesananIdANDProdukIdIsTheSame({ produkId: 1, pesananId: 'INV001', data: orderListData })).toBe(upsertedOrderList);
    });

    it('should create a new order list if none exists', async () => {
      const orderListData = { produkId: 1, pesananId: 'INV001', quantity: 2, note: 'Test note', pesanan:{}, produk:{} };
      const createdOrderList: OrderList = { id: 1, ...orderListData } as OrderList;

      jest.spyOn(prisma.orderList, 'findFirst').mockResolvedValue(null);
      jest.spyOn(prisma.orderList, 'upsert').mockResolvedValue(createdOrderList);

      expect(await service.upsertOrderListWherePesananIdANDProdukIdIsTheSame({ produkId: 1, pesananId: 'INV001', data: orderListData })).toBe(createdOrderList);
    });
  });
});
