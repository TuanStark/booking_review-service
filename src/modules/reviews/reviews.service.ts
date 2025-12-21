import {
  Injectable,
  ForbiddenException,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';


import { CreateReviewDto } from './dto/create-review.dto';
import { REDIS_KEY } from '../../common/constants/redis-key.constant';
import { TTL } from '../../common/constants/ttl.constant';
import { ExternalService } from 'src/common/external/external.service';
import { RedisService } from 'src/messaging/redis/redis.service';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class ReviewService {
  constructor(
    private prisma: PrismaClient,
    private redis: RedisService,
    private external: ExternalService,
  ) {}

  async createReview(userId: number, dto: CreateReviewDto) {
    // 1. Booking
    let booking = await this.redis.get<any>(
      REDIS_KEY.BOOKING(dto.bookingId),
    );

    if (!booking) {
      booking = await this.external.getBooking(dto.bookingId);
      if (!booking) throw new NotFoundException('Booking not found');
      await this.redis.set(
        REDIS_KEY.BOOKING(dto.bookingId),
        booking,
        TTL.BOOKING,
      );
    }

    // 2. Validate
    if (booking.userId !== userId)
      throw new ForbiddenException('Not your booking');

    if (booking.status !== 'COMPLETED')
      throw new ForbiddenException('Booking not completed');

    // 3. Duplicate check
    const existed = await this.prisma.roomReview.findUnique({
      where: { 
        bookingId: String(dto.bookingId) 
      },
    });
    if (existed) throw new ConflictException('Already reviewed');

    // 4. Room cache
    const roomKey = REDIS_KEY.ROOM(booking.roomId);
    if (!(await this.redis.get(roomKey))) {
      const room = await this.external.getRoom(booking.roomId);
      if (!room) throw new NotFoundException('Room not found');
      await this.redis.set(roomKey, room, TTL.ROOM);
    }

    // 5. Create review
    return this.prisma.roomReview.create({
      data: {
        roomId: String(booking.roomId),
        userId: String(userId),
        bookingId: String(dto.bookingId),
        ratingOverall: dto.ratingOverall,
        ratingClean: dto.ratingClean,
        comment: dto.comment,
        images: {
          create: dto.images?.map(url => ({ imageUrl: url })),
        },
      },
    });
  }

  async getByRoom(roomId: number) {
    const reviews = await this.prisma.roomReview.findMany({
      where: { roomId: String(roomId), status: 'VISIBLE' },
      include: { images: true, reply: true },
      orderBy: { createdAt: 'desc' },
    });

    for (const r of reviews) {
      const userIdNum = Number(r.userId);
      const key = REDIS_KEY.USER(userIdNum);
      let user = await this.redis.get(key);

      if (!user) {
        user = await this.external.getUser(userIdNum);
        if (user) await this.redis.set(key, user, TTL.USER);
      }

      r['user'] = user;
    }

    return reviews;
  }
}
