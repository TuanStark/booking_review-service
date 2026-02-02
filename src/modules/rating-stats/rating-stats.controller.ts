import { Controller, Get, Param, Query } from '@nestjs/common';
import { RatingStatsService } from './rating-stats.service';

@Controller('rating-stats')
export class RatingStatsController {
  constructor(private readonly service: RatingStatsService) { }

  @Get(':roomId')
  getStats(@Param('roomId') roomId: string) {
    return this.service.getStats(roomId);
  }

  @Get()
  getStatsForRooms(@Query('roomIds') roomIds: string) {
    if (!roomIds) return [];
    const ids = roomIds.split(',').filter((id) => id.trim().length > 0);
    return this.service.getStatsForRooms(ids);
  }
}
