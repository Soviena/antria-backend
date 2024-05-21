import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { Review, Prisma } from '@prisma/client';

@Injectable()
export class ReviewService {
  constructor(private prisma: PrismaService) {}

  async createReview(data: any): Promise<Review> {
    const { pelangganId, mitraId, ...reviewData } = data
    return this.prisma.review.create({
      data:{
        mitra:{
            connect:{
                id:mitraId
            }
        },
        reviewer:{
            connect:{
                id:pelangganId
            }
        },
        ...reviewData
      }
    });
  }

  async getReview(mitraId: number, pelangganId: number): Promise<Review | null> {
    return this.prisma.review.findUnique({
      where: {
        mitraId_pelangganId: {
          mitraId,
          pelangganId,
        },
      },
    });
  }

  async updateReview(params: {
    mitraId: number;
    pelangganId: number;
    data: Prisma.ReviewUpdateInput;
  }): Promise<Review> {
    const { mitraId, pelangganId, data } = params;
    return this.prisma.review.update({
      where: {
        mitraId_pelangganId: {
          mitraId,
          pelangganId,
        },
      },
      data,
    });
  }

  async deleteReview(mitraId: number, pelangganId: number): Promise<Review> {
    return this.prisma.review.delete({
      where: {
        mitraId_pelangganId: {
          mitraId,
          pelangganId,
        },
      },
    });
  }

  async getAllReviews(): Promise<Review[]> {
    return this.prisma.review.findMany();
  }

  async getAllReviewsFromMitra(mitraId:number): Promise<Review[]> {
    return this.prisma.review.findMany({
        where:{
            mitraId:mitraId
        }
    });
  }
}
