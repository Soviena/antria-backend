
import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { ReviewService } from './review.service';
import { Review } from '@prisma/client';
import { ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/auth/auth.guards';

@ApiTags('reviews')
@Controller('reviews')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @Post()
  @UseGuards(AuthGuard)
  async createReview(@Body() data: any): Promise<Review> {
    return this.reviewService.createReview(data);
  }

  @Get('mitra/:mitraId')
  @UseGuards(AuthGuard)
  async getAllReviewsFromMitra(@Param('mitraId') mitraId:string): Promise<Review[]> {
    return this.reviewService.getAllReviewsFromMitra(parseInt(mitraId));
  }

  @Get('pelanggan/:pelangganId')
  @UseGuards(AuthGuard)
  async getAllReviewsFromPelanggan(@Param('pelangganId') pelangganId:string): Promise<Review[]> {
    return this.reviewService.getAllReviewsFromPelanggan(parseInt(pelangganId));
  }

  @Get(':mitraId/:pelangganId')
  @UseGuards(AuthGuard)
  async getReview(
    @Param('mitraId') mitraId: string,
    @Param('pelangganId') pelangganId: string
  ): Promise<Review | null> {
    return this.reviewService.getReview(parseInt(mitraId), parseInt(pelangganId));
  }

  @Put(':mitraId/:pelangganId')
  @UseGuards(AuthGuard)
  async updateReview(
    @Param('mitraId') mId: string,
    @Param('pelangganId') pId: string,
    @Body() data: any
  ): Promise<Review> {
    let mitraId = parseInt(mId)
    let pelangganId = parseInt(pId)
    return this.reviewService.updateReview({ mitraId, pelangganId, data });
  }

  @Delete(':mitraId/:pelangganId')
  @UseGuards(AuthGuard)
  async deleteReview(
    @Param('mitraId') mitraId: number,
    @Param('pelangganId') pelangganId: number
  ): Promise<Review> {
    return this.reviewService.deleteReview(mitraId, pelangganId);
  }

  @Get()
  @UseGuards(AuthGuard)
  async getAllReviews(): Promise<Review[]> {
    return this.reviewService.getAllReviews();
  }


}
