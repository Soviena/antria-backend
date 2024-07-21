import { Test, TestingModule } from '@nestjs/testing';
import { ReviewService } from './review.service';
import { PrismaService } from '../prisma.service';
import { Review } from '@prisma/client';
import { JwtService } from '@nestjs/jwt';

describe('ReviewService', () => {
  let service: ReviewService;
  let prismaService: PrismaService;

  const mockPrismaService = {
    review: {
      create: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      findMany: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn().mockReturnValue('mockedJwtToken'),
            verify: jest.fn(),
          },
        },
        ReviewService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<ReviewService>(ReviewService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createReview', () => {
    it('should create a review', async () => {
      const mitra_id = 1
      const pelanggan_id = 1
      const reviewData = {
        rating     :4,
        komentar   :"Enak",
        mitraId: mitra_id,
        pelangganId: pelanggan_id,
        created_at :new Date(2024, 6, 21, 12, 0, 0),
        updated_at :new Date(2024, 6, 21, 12, 0, 0),
      };
      const review = { id: 1,mitraId: mitra_id, pelangganId: pelanggan_id, ...reviewData } as Review;
      mockPrismaService.review.create.mockResolvedValue(review);

      expect(await service.createReview(reviewData)).toBe(review);
      expect(mockPrismaService.review.create).toHaveBeenCalledWith({
        data: {
          mitra: { connect: { id: mitra_id } },
          reviewer: { connect: { id: pelanggan_id } },
          rating     :4,
          komentar   :"Enak",
          created_at :new Date(2024, 6, 21, 12, 0, 0),
          updated_at :new Date(2024, 6, 21, 12, 0, 0),
        },
      });
    });
  });

  describe('getReview', () => {
    it('should return a review by mitraId and pelangganId', async () => {
      const review = {
          rating     :4,
          komentar   :"Enak",
          mitraId    :1,
          pelangganId:1,
          created_at :new Date(2024, 6, 21, 12, 0, 0),
          updated_at :new Date(2024, 6, 21, 12, 0, 0),
        };
      mockPrismaService.review.findUnique.mockResolvedValue(review);

      expect(await service.getReview(1, 1)).toBe(review);
      expect(mockPrismaService.review.findUnique).toHaveBeenCalledWith({
        where: { mitraId_pelangganId: { mitraId: 1, pelangganId: 1 } },
      });
    });
  });

  describe('updateReview', () => {
    it('should update a review', async () => {
      const review = {
        rating     :4,
        komentar   :"Enak",
        mitraId    :1,
        pelangganId:1,
        created_at :new Date(2024, 6, 21, 12, 0, 0),
        updated_at :new Date(2024, 6, 21, 12, 0, 0),
      };
      const updateData = { rating: 4, comment: 'Good!' };
      mockPrismaService.review.update.mockResolvedValue(review);

      expect(await service.updateReview({ mitraId: 1, pelangganId: 1, data: updateData })).toBe(review);
      expect(mockPrismaService.review.update).toHaveBeenCalledWith({
        where: { mitraId_pelangganId: { mitraId: 1, pelangganId: 1 } },
        data: updateData,
      });
    });
  });

  describe('deleteReview', () => {
    it('should delete a review', async () => {
      const review = {
          rating     :4,
          komentar   :"Enak",
          mitraId    :1,
          pelangganId:1,
          created_at :new Date(2024, 6, 21, 12, 0, 0),
          updated_at :new Date(2024, 6, 21, 12, 0, 0),
        };
      mockPrismaService.review.delete.mockResolvedValue(review);

      expect(await service.deleteReview(1, 1)).toBe(review);
      expect(mockPrismaService.review.delete).toHaveBeenCalledWith({
        where: { mitraId_pelangganId: { mitraId: 1, pelangganId: 1 } },
      });
    });
  });

  describe('getAllReviews', () => {
    it('should return all reviews', async () => {
      const reviews = [
        {
          rating     :4,
          komentar   :"Enak",
          mitraId    :1,
          pelangganId:1,
          created_at :new Date(2024, 6, 21, 12, 0, 0),
          updated_at :new Date(2024, 6, 21, 12, 0, 0),
        },
        {
          rating     :5,
          komentar   :"Super Enak",
          mitraId    :1,
          pelangganId:2,
          created_at :new Date(2024, 6, 21, 12, 0, 0),
          updated_at :new Date(2024, 6, 21, 12, 0, 0),
        },
      ];
      mockPrismaService.review.findMany.mockResolvedValue(reviews);

      expect(await service.getAllReviews()).toBe(reviews);
      expect(mockPrismaService.review.findMany).toHaveBeenCalledWith();
    });
  });

  describe('getAllReviewsFromMitra', () => {
    it('should return all reviews from a mitra', async () => {
      const reviews = [
        {
          rating     :4,
          komentar   :"Enak",
          mitraId    :1,
          pelangganId:1,
          created_at :new Date(2024, 6, 21, 12, 0, 0),
          updated_at :new Date(2024, 6, 21, 12, 0, 0),
        },
        {
          rating     :5,
          komentar   :"Enak",
          mitraId    :1,
          pelangganId:2,
          created_at :new Date(2024, 6, 21, 12, 0, 0),
          updated_at :new Date(2024, 6, 21, 12, 0, 0),
        },
      ];
      mockPrismaService.review.findMany.mockResolvedValue(reviews);

      expect(await service.getAllReviewsFromMitra(1)).toBe(reviews);
      expect(mockPrismaService.review.findMany).toHaveBeenCalledWith({
        where: { mitraId: 1 },
        include: { reviewer: true },
      });
    });
  });

  describe('getAllReviewsFromPelanggan', () => {
    it('should return all reviews from a pelanggan', async () => {
      const reviews = [
        {
          rating     :4,
          komentar   :"Enak",
          mitraId    :1,
          pelangganId:1,
          created_at :new Date(2024, 6, 21, 12, 0, 0),
          updated_at :new Date(2024, 6, 21, 12, 0, 0),
        },
        {
          rating     :5,
          komentar   :"Enak",
          mitraId    :1,
          pelangganId:2,
          created_at :new Date(2024, 6, 21, 12, 0, 0),
          updated_at :new Date(2024, 6, 21, 12, 0, 0),
        },
      ];
      mockPrismaService.review.findMany.mockResolvedValue(reviews);

      expect(await service.getAllReviewsFromPelanggan(1)).toBe(reviews);
      expect(mockPrismaService.review.findMany).toHaveBeenCalledWith({
        where: { pelangganId: 1 },
        include: { mitra: true },
      });
    });
  });
});
