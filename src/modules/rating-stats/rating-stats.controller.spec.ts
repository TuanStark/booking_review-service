import { Test, TestingModule } from '@nestjs/testing';
import { RatingStatsController } from './rating-stats.controller';
import { RatingStatsService } from './rating-stats.service';

describe('RatingStatsController', () => {
  let controller: RatingStatsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RatingStatsController],
      providers: [RatingStatsService],
    }).compile();

    controller = module.get<RatingStatsController>(RatingStatsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
