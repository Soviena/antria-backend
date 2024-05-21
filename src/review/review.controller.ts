
import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { ReviewService } from './review.service';
import { Review } from '@prisma/client';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('reviews')
@Controller('reviews')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @Post()
  async createReview(@Body() data: any): Promise<Review> {
    return this.reviewService.createReview(data);
  }

  @Get('mitra/:mitraId')
  async getAllReviewsFromMitra(@Param('mitraId') mitraId:string): Promise<Review[]> {
    return this.reviewService.getAllReviewsFromMitra(parseInt(mitraId));
  }

  @Get(':mitraId/:pelangganId')
  async getReview(
    @Param('mitraId') mitraId: number,
    @Param('pelangganId') pelangganId: number
  ): Promise<Review | null> {
    return this.reviewService.getReview(mitraId, pelangganId);
  }

  @Put(':mitraId/:pelangganId')
  async updateReview(
    @Param('mitraId') mitraId: number,
    @Param('pelangganId') pelangganId: number,
    @Body() data: any
  ): Promise<Review> {
    return this.reviewService.updateReview({ mitraId, pelangganId, data });
  }

  @Delete(':mitraId/:pelangganId')
  async deleteReview(
    @Param('mitraId') mitraId: number,
    @Param('pelangganId') pelangganId: number
  ): Promise<Review> {
    return this.reviewService.deleteReview(mitraId, pelangganId);
  }

  @Get()
  async getAllReviews(): Promise<Review[]> {
    return this.reviewService.getAllReviews();
  }


}
