import { Test, TestingModule } from '@nestjs/testing';
import { ReviewsImagesController } from './reviews-images.controller';
import { ReviewsImagesService } from './reviews-images.service';

describe('ReviewsImagesController', () => {
  let controller: ReviewsImagesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ReviewsImagesController],
      providers: [ReviewsImagesService],
    }).compile();

    controller = module.get<ReviewsImagesController>(ReviewsImagesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
