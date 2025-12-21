import { Module } from '@nestjs/common';
import { ReviewController } from './reviews.controller';
import { ReviewService } from './reviews.service';
import { PrismaClient } from '@prisma/client';


@Module({
  imports: [
    PrismaClient
  ],
  controllers: [ReviewController],
  providers: [ReviewService],
})
export class ReviewsModule {}
