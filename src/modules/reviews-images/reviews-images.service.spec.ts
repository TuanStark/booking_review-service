import { Test, TestingModule } from '@nestjs/testing';
import { ReviewsImagesService } from './reviews-images.service';

describe('ReviewsImagesService', () => {
  let service: ReviewsImagesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ReviewsImagesService],
    }).compile();

    service = module.get<ReviewsImagesService>(ReviewsImagesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
