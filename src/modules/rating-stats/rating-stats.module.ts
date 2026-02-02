import { Module } from '@nestjs/common';
import { RatingStatsService } from './rating-stats.service';
import { RatingStatsController } from './rating-stats.controller';
import { RedisModule } from '../../messaging/redis/redis.module';

@Module({
  imports: [RedisModule],
  controllers: [RatingStatsController],
  providers: [RatingStatsService],
  exports: [RatingStatsService],
})
export class RatingStatsModule { }
