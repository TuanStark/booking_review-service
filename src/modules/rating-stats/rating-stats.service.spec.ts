import { Test, TestingModule } from '@nestjs/testing';
import { RatingStatsService } from './rating-stats.service';

describe('RatingStatsService', () => {
  let service: RatingStatsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RatingStatsService],
    }).compile();

    service = module.get<RatingStatsService>(RatingStatsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
