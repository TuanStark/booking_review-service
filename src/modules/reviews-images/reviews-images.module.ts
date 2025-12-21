import { Module } from '@nestjs/common';
import { ReviewsImagesService } from './reviews-images.service';
import { ReviewsImagesController } from './reviews-images.controller';

@Module({
  controllers: [ReviewsImagesController],
  providers: [ReviewsImagesService],
})
export class ReviewsImagesModule {}
