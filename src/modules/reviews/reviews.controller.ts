import { Controller, Post, Get, Body, Param, Req } from '@nestjs/common';

import { CreateReviewDto } from './dto/create-review.dto';
import { ReviewService } from './reviews.service';

@Controller('reviews')
export class ReviewController {
  constructor(private readonly service: ReviewService) {}

  @Post()
  create(@Req() req, @Body() dto: CreateReviewDto) {
    return this.service.createReview(req.user.id, dto);
  }

  @Get('room/:roomId')
  getByRoom(@Param('roomId') roomId: number) {
    return this.service.getByRoom(+roomId);
  }
}
