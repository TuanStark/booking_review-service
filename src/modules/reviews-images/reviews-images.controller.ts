import { Controller } from '@nestjs/common';
import { ReviewsImagesService } from './reviews-images.service';

@Controller('reviews-images')
export class ReviewsImagesController {
  constructor(private readonly reviewsImagesService: ReviewsImagesService) {}
}
