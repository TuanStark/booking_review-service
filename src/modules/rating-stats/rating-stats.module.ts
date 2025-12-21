import { Module } from '@nestjs/common';
import { RatingStatsService } from './rating-stats.service';
import { RatingStatsController } from './rating-stats.controller';

@Module({
  controllers: [RatingStatsController],
  providers: [RatingStatsService],
})
export class RatingStatsModule {}
