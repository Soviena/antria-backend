import { Test, TestingModule } from '@nestjs/testing';
import { OrderlistController } from './orderlist.controller';
import { OrderlistService } from './orderlist.service';
import { OrderList, Prisma } from '@prisma/client';
import { AuthGuard } from 'src/auth/auth.guards';
import { ExecutionContext } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

describe('OrderlistController', () => {
  let orderlistController: OrderlistController;
  let orderlistService: OrderlistService;

  const mockOrderlistService = {
    createOrderList: jest.fn(),
    getOrderListById: jest.fn(),
    getOrderListByInvoice: jest.fn(),
    updateOrderList: jest.fn(),
    deleteOrderList: jest.fn(),
  };

  const mockExecutionContext = {
    switchToHttp: () => ({
      getRequest: () => ({}),
    }),
  } as unknown as ExecutionContext;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrderlistController],
      providers: [
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn().mockReturnValue('mockedJwtToken'),
            verify: jest.fn(),
          },
        },
        { provide: OrderlistService, useValue: mockOrderlistService },
      ],
    }).compile();

    orderlistController = module.get<OrderlistController>(OrderlistController);
    orderlistService = module.get<OrderlistService>(OrderlistService);
  });

  it('should be defined', () => {
    expect(orderlistController).toBeDefined();
  });

  describe('create', () => {
    it('should create and return an order list', async () => {
      const orderListData: Prisma.OrderListCreateInput = { item: 'Test Item', quantity: 10 } as any;
      const createdOrderList: OrderList = { id: 1, ...orderListData } as any;

      jest.spyOn(orderlistService, 'createOrderList').mockResolvedValue(createdOrderList);

      expect(await orderlistController.create(orderListData)).toBe(createdOrderList);
    });
  });

  describe('createMany', () => {
    it('should create and return multiple order lists', async () => {
      const orderListData: Prisma.OrderListCreateManyInput[] = [
        {
          id        :1,
          quantity  :1,
          note      :"notes",
          pesananId :"INVC11223344",
          produkId  :1
        },
        {
          id        :2,
          quantity  :1,
          note      :"notes",
          pesananId :"INVC11223344",
          produkId  :2
        }
      ];
      const createdOrderLists: OrderList[] = [
        {
          id        :1,
          quantity  :1,
          note      :"notes",
          pesananId :"INVC11223344",
          produkId  :1
        },
        {
          id        :2,
          quantity  :1,
          note      :"notes",
          pesananId :"INVC11223344",
          produkId  :2
        }
      ];

      jest.spyOn(orderlistService, 'createOrderList').mockImplementation(async (data: any) => {
        return {
          id        :data.id,
          quantity  :data.quantity,
          note      :data.note,
          pesananId :data.pesananId,
          produkId  :data.produkId
        }
      })

      expect(await orderlistController.createMany(orderListData)).toEqual(createdOrderLists);
    });
  });

  describe('findOne', () => {
    it('should return an order list by ID', async () => {
      const orderListId = 1;
      const orderList: OrderList = { id: orderListId, item: 'Test Item', quantity: 10 } as any;

      jest.spyOn(orderlistService, 'getOrderListById').mockResolvedValue(orderList);

      expect(await orderlistController.findOne(orderListId.toString())).toBe(orderList);
    });
  });

  describe('getAllOrderFromInvoice', () => {
    it('should return all order lists from an invoice', async () => {
      const invoice = 'INV123';
      const orders: OrderList[] = [
        { id: 1, item: 'Item 1', quantity: 1, invoice } as any,
        { id: 2, item: 'Item 2', quantity: 2, invoice } as any,
      ];

      jest.spyOn(orderlistService, 'getOrderListByInvoice').mockResolvedValue(orders);

      expect(await orderlistController.getAllOrderFromInvoice(invoice)).toEqual(orders);
    });
  });

  describe('update', () => {
    it('should update and return an order list', async () => {
      const orderListId = 1;
      const updateData: Prisma.OrderListUpdateInput = { quantity: 20 } as any;
      const updatedOrderList: OrderList = { id: orderListId, item: 'Test Item', quantity: 20 } as any;

      jest.spyOn(orderlistService, 'updateOrderList').mockResolvedValue(updatedOrderList);

      expect(await orderlistController.update(orderListId.toString(), updateData)).toBe(updatedOrderList);
    });
  });

  describe('remove', () => {
    it('should delete and return an order list', async () => {
      const orderListId = 1;
      const deletedOrderList: OrderList = { id: orderListId, item: 'Test Item', quantity: 10 } as any;

      jest.spyOn(orderlistService, 'deleteOrderList').mockResolvedValue(deletedOrderList);

      expect(await orderlistController.remove(orderListId.toString())).toBe(deletedOrderList);
    });
  });
});
