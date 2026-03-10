import { Test, type TestingModule } from '@nestjs/testing';
import { RatingStatsController } from './rating-stats.controller';
import { RatingStatsService } from './rating-stats.service';
import { RedisService } from '../../messaging/redis/redis.service';
import { PrismaService } from '../../prisma/prisma.service';

describe('RatingStatsController', () => {
  let controller: RatingStatsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RatingStatsController],
      providers: [
        RatingStatsService,
        {
          provide: RedisService,
          useValue: {
            get: jest.fn(),
            set: jest.fn(),
            del: jest.fn(),
          },
        },
        {
          provide: PrismaService,
          useValue: {
            roomReview: { aggregate: jest.fn() },
            roomRatingStat: {
              upsert: jest.fn(),
              delete: jest.fn(),
              findUnique: jest.fn(),
              findMany: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    controller = module.get<RatingStatsController>(RatingStatsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
