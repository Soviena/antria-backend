import { Test, TestingModule } from '@nestjs/testing';
import { ReviewController } from './review.controller';
import { ReviewService } from './review.service';
import { Review } from '@prisma/client';
import { AuthGuard } from 'src/auth/auth.guards';
import { ExecutionContext } from '@nestjs/common';

describe('ReviewController', () => {
  let controller: ReviewController;
  let service: ReviewService;

  const mockReviewService = {
    createReview: jest.fn(),
    getAllReviewsFromMitra: jest.fn(),
    getAllReviewsFromPelanggan: jest.fn(),
    getReview: jest.fn(),
    updateReview: jest.fn(),
    deleteReview: jest.fn(),
    getAllReviews: jest.fn(),
  };

  const mockAuthGuard = {
    canActivate: jest.fn().mockReturnValue(true),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ReviewController],
      providers: [
        { provide: ReviewService, useValue: mockReviewService },
      ],
    })
      .overrideGuard(AuthGuard)
      .useValue(mockAuthGuard)
      .compile();

    controller = module.get<ReviewController>(ReviewController);
    service = module.get<ReviewService>(ReviewService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('createReview', () => {
    it('should create a new review', async () => {
      const review = {
        rating     :4,
        komentar   :"Enak",
        mitraId    :1,
        pelangganId:1,
        created_at :new Date(2024, 6, 21, 12, 0, 0),
        updated_at :new Date(2024, 6, 21, 12, 0, 0),
      };
      mockReviewService.createReview.mockResolvedValue(review);

      expect(await controller.createReview(review)).toBe(review);
      expect(mockReviewService.createReview).toHaveBeenCalledWith(review);
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
          komentar   :"Very Enak",
          mitraId    :1,
          pelangganId:2,
          created_at :new Date(2024, 6, 21, 12, 0, 0),
          updated_at :new Date(2024, 6, 21, 12, 0, 0),
        },
      ];
      mockReviewService.getAllReviewsFromMitra.mockResolvedValue(reviews);

      expect(await controller.getAllReviewsFromMitra('1')).toBe(reviews);
      expect(mockReviewService.getAllReviewsFromMitra).toHaveBeenCalledWith(1);
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
          komentar   :"Super Enak",
          mitraId    :1,
          pelangganId:3,
          created_at :new Date(2024, 6, 21, 12, 0, 0),
          updated_at :new Date(2024, 6, 21, 12, 0, 0),
        }
      ];
      mockReviewService.getAllReviewsFromPelanggan.mockResolvedValue(reviews);

      expect(await controller.getAllReviewsFromPelanggan('1')).toBe(reviews);
      expect(mockReviewService.getAllReviewsFromPelanggan).toHaveBeenCalledWith(1);
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
      mockReviewService.getReview.mockResolvedValue(review);

      expect(await controller.getReview('1', '1')).toBe(review);
      expect(mockReviewService.getReview).toHaveBeenCalledWith(1, 1);
    });
  });

  describe('updateReview', () => {
    it('should update a review by mitraId and pelangganId', async () => {
      const review = {
        rating     :4,
        komentar   :"Enak",
        mitraId    :1,
        pelangganId:1,
        created_at :new Date(2024, 6, 21, 12, 0, 0),
        updated_at :new Date(2024, 6, 21, 12, 0, 0),
      };
      const data = { rating: 4, comment: 'Good!' };
      mockReviewService.updateReview.mockResolvedValue(review);

      expect(await controller.updateReview('1', '1', data)).toBe(review);
      expect(mockReviewService.updateReview).toHaveBeenCalledWith({ mitraId: 1, pelangganId: 1, data });
    });
  });

  describe('deleteReview', () => {
    it('should delete a review by mitraId and pelangganId', async () => {
      const review = {
        rating     :4,
        komentar   :"Enak",
        mitraId    :1,
        pelangganId:1,
        created_at :new Date(2024, 6, 21, 12, 0, 0),
        updated_at :new Date(2024, 6, 21, 12, 0, 0),
      };
      mockReviewService.deleteReview.mockResolvedValue(review);

      expect(await controller.deleteReview(1, 1)).toBe(review);
      expect(mockReviewService.deleteReview).toHaveBeenCalledWith(1, 1);
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
          rating     :3,
          komentar   :"G Enak",
          mitraId    :1,
          pelangganId:2,
          created_at :new Date(2024, 6, 21, 12, 0, 0),
          updated_at :new Date(2024, 6, 21, 12, 0, 0),
        }
      ];
      mockReviewService.getAllReviews.mockResolvedValue(reviews);

      expect(await controller.getAllReviews()).toBe(reviews);
      expect(mockReviewService.getAllReviews).toHaveBeenCalled();
    });
  });
});
