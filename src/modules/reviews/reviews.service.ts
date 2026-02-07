import {
  Injectable,
  NotFoundException,
  ConflictException,
  ForbiddenException,
  Logger,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { PaginationDto } from './dto/pagination.dto';
import { REDIS_KEY } from '../../common/constants/redis-key.constant';
import { TTL } from '../../common/constants/ttl.constant';
import { ExternalService } from '../../common/external/external.service';
import { RedisService } from '../../messaging/redis/redis.service';
import { RatingStatsService } from '../rating-stats/rating-stats.service';
import {
  ReviewWithUser,
  PaginatedResponse,
} from '../../common/types/review.types';
import { RoomReview } from '@prisma/client';
import { UpdateReviewDto } from './dto/update-review.dto';
import { QueryReviewDto } from './dto/query-reviews.dto';

@Injectable()
export class ReviewService {
  private readonly logger = new Logger(ReviewService.name);

  constructor(
    private prisma: PrismaService,
    private redis: RedisService,
    private external: ExternalService,
    private ratingStats: RatingStatsService,
  ) { }

  /**
   * Create a new review.
   * Validates booking ownership and completion status.
   * Updates rating stats immediately.
   */
  async createReview(userId: string, dto: CreateReviewDto): Promise<RoomReview> {
    // 1. Get Booking Info
    const bookingKey = REDIS_KEY.BOOKING(dto.bookingId);

    let booking = await this.redis.get<any>(bookingKey);

    if (!booking) {
      booking = await this.external.getBooking(dto.bookingId);
      if (!booking) throw new NotFoundException('Booking not found');
      await this.redis.set(
        bookingKey,
        booking,
        TTL.BOOKING,
      );
    }

    // 2. Validate
    if (String(booking.userId) !== userId)
      throw new ForbiddenException('Not your booking');

    if (booking.status !== 'COMPLETED')
      throw new ForbiddenException('Booking not completed');

    // 3. Duplicate check
    const existed = await this.prisma.roomReview.findUnique({
      where: {
        bookingId: dto.bookingId,
      },
    });
    if (existed) throw new ConflictException('Already reviewed');

    // 4. Room validation (ensure room exists)
    // We trust booking.roomId is valid, but good to check/cache room info
    const roomId = String(booking.roomId);

    // 5. Create review
    const review = await this.prisma.roomReview.create({
      data: {
        roomId,
        userId,
        bookingId: dto.bookingId,
        ratingOverall: dto.ratingOverall,
        ratingClean: dto.ratingClean,
        ratingLocation: dto.ratingLocation,
        ratingPrice: dto.ratingPrice,
        ratingService: dto.ratingService,
        comment: dto.comment,
        // No images relation anymore
      },
    });
    console.log(review);

    // 6. Update stats & clear cache
    await this.ratingStats.recalculateStats(roomId);
    await this.redis.del(REDIS_KEY.ROOM_REVIEWS(roomId));

    return review;
  }

  /**
   * Get reviews by room with cursor pagination.
   */
  async getByRoom(
    roomId: string,
    pagination: PaginationDto,
  ): Promise<PaginatedResponse<ReviewWithUser>> {
    const limit = pagination.limit || 10;
    const cursor = pagination.cursor;

    // Try cache for first page only? 
    // For simplicity, we cache the first page (no cursor)
    if (!cursor) {
      const cached = await this.redis.get<PaginatedResponse<ReviewWithUser>>(
        REDIS_KEY.ROOM_REVIEWS(roomId)
      );
      if (cached) return cached;
    }

    const reviews = await this.prisma.roomReview.findMany({
      where: {
        roomId,
        status: 'VISIBLE',
      },
      take: limit + 1, // Fetch one extra to check if there are more
      cursor: cursor ? { id: cursor } : undefined,
      orderBy: { createdAt: 'desc' },
    });

    let hasMore = false;
    let nextCursor: string | null = null;

    if (reviews.length > limit) {
      hasMore = true;
      const nextItem = reviews.pop();
      nextCursor = nextItem?.id || null;
    }

    // Enrich with user info
    const enrichedReviews: ReviewWithUser[] = [];
    for (const r of reviews) {
      const user = await this.getUserInfo(r.userId);
      enrichedReviews.push({ ...r, user });
    }

    const response = {
      data: enrichedReviews,
      nextCursor,
      hasMore,
    };

    // Cache first page
    if (!cursor) {
      await this.redis.set(REDIS_KEY.ROOM_REVIEWS(roomId), response, TTL.ROOM);
    }

    return response;
  }

  async findAll(query: QueryReviewDto, token?: string) {
    const { sortBy = 'createdAt', sortOrder = 'desc' } = query;
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 10;

    if (page < 1 || limit < 1) {
      throw new Error('Page and limit must be greater than 0');
    }

    const skip = (page - 1) * limit;
    const take = limit;

    const where: any = {};

    if (query.search) {
      const searchCap =
        query.search.charAt(0).toUpperCase() + query.search.slice(1);

      where.OR = [
        { title: { contains: searchCap } },
        { content: { contains: searchCap } },
      ];
    }

    if (query.status) {
      where.status = query.status;
    }

    const orderBy = { [sortBy]: sortOrder };

    const [reviews, total] = await Promise.all([
      this.prisma.roomReview.findMany({
        where,
        orderBy,
        skip,
        take,
      }),

      this.prisma.roomReview.count({ where }),
    ]);

    const reviewsWithUser = await this.enrichReviewsWithUserData(reviews, token);

    return {
      data: reviewsWithUser,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getByUser(
    userId: string,
    pagination: PaginationDto,
  ): Promise<PaginatedResponse<RoomReview>> {
    const limit = pagination.limit || 10;
    const cursor = pagination.cursor;

    const reviews = await this.prisma.roomReview.findMany({
      where: {
        userId,
        status: { not: 'DELETED' },
      },
      take: limit + 1,
      cursor: cursor ? { id: cursor } : undefined,
      orderBy: { createdAt: 'desc' },
    });

    let hasMore = false;
    let nextCursor: string | null = null;

    if (reviews.length > limit) {
      hasMore = true;
      const nextItem = reviews.pop();
      nextCursor = nextItem?.id || null;
    }

    return {
      data: reviews,
      nextCursor,
      hasMore,
    };
  }

  async updateReview(
    reviewId: string,
    userId: string,
    dto: UpdateReviewDto,
  ): Promise<RoomReview> {
    const review = await this.prisma.roomReview.findUnique({
      where: { id: reviewId },
    });

    if (!review) throw new NotFoundException('Review not found');
    if (review.userId !== userId)
      throw new ForbiddenException('Not your review');

    const updated = await this.prisma.roomReview.update({
      where: { id: reviewId },
      data: {
        ...dto,
      },
    });

    // Update stats & clear cache
    await this.ratingStats.recalculateStats(updated.roomId);
    await this.redis.del(REDIS_KEY.ROOM_REVIEWS(updated.roomId));

    return updated;
  }

  async deleteReview(reviewId: string, userId: string): Promise<void> {
    const review = await this.prisma.roomReview.findUnique({
      where: { id: reviewId },
    });

    if (!review) throw new NotFoundException('Review not found');
    if (review.userId !== userId)
      throw new ForbiddenException('Not your review');

    await this.prisma.roomReview.update({
      where: { id: reviewId },
      data: { status: 'DELETED' },
    });

    // Update stats & clear cache
    await this.ratingStats.recalculateStats(review.roomId);
    await this.redis.del(REDIS_KEY.ROOM_REVIEWS(review.roomId));
  }

  private async getUserInfo(userId: string) {
    const key = REDIS_KEY.USER(userId);
    let user = await this.redis.get<any>(key);
    if (!user) {
      user = await this.external.getUser(userId);
      if (user) await this.redis.set(key, user, TTL.USER);
    }
    return user;
  }

  private async enrichReviewsWithUserData(reviews: any[], token?: string) {
    if (reviews.length === 0) {
      return reviews;
    }

    // Collect tất cả userId
    const userIds: string[] = [];
    reviews.forEach((review) => {
      if (review.userId && !userIds.includes(review.userId)) {
        userIds.push(review.userId);
      }
    });

    // Fetch users parallel (tối ưu performance)
    const usersMap = await this.getUserInfo(userIds.join(','));

    // Map user data vào reviews
    return reviews.map((review) => ({
      ...review,
      user: usersMap.get(review.userId) || null,
    }));
  }
}
