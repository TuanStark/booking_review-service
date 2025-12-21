import { Controller } from '@nestjs/common';
import { RatingStatsService } from './rating-stats.service';

@Controller('rating-stats')
export class RatingStatsController {
  constructor(private readonly ratingStatsService: RatingStatsService) {}
}
