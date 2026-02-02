import { Module } from '@nestjs/common';
import { ReviewService } from './reviews.service';
import { ReviewController } from './reviews.controller';
import { RatingStatsModule } from '../rating-stats/rating-stats.module';
import { RedisModule } from '../../messaging/redis/redis.module';
import { ExternalModule } from '../../common/external/external.module';

@Module({
  imports: [RatingStatsModule, RedisModule, ExternalModule],
  controllers: [ReviewController],
  providers: [ReviewService],
  exports: [ReviewService],
})
export class ReviewsModule { }
