import { Test, type TestingModule } from '@nestjs/testing';
import { RatingStatsService } from './rating-stats.service';
import { RedisService } from '../../messaging/redis/redis.service';
import { PrismaService } from '../../prisma/prisma.service';

describe('RatingStatsService', () => {
  let service: RatingStatsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
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

    service = module.get<RatingStatsService>(RatingStatsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
