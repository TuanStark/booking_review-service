import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { ExternalModule } from './common/external/external.module';
import { ConfigModule } from '@nestjs/config';
import { ReviewsModule } from './modules/reviews/reviews.module';
import { ReviewsImagesModule } from './modules/reviews-images/reviews-images.module';
import { RatingStatsModule } from './modules/rating-stats/rating-stats.module';

@Module({
 imports: [PrismaModule, ExternalModule, ConfigModule.forRoot({
    isGlobal: true,
  }), ReviewsModule, ReviewsImagesModule, RatingStatsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
