import { Injectable, Logger } from '@nestjs/common';
import { Prisma, RoomRatingStat } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { RedisService } from '../../messaging/redis/redis.service';
import { REDIS_KEY } from '../../common/constants/redis-key.constant';
import { TTL } from '../../common/constants/ttl.constant';

@Injectable()
export class RatingStatsService {
    private readonly logger = new Logger(RatingStatsService.name);

    constructor(
        private readonly redis: RedisService,
        private readonly prisma: PrismaService,
    ) { }

    /**
     * Recalculate and update rating stats for a room.
     * Should be called after create/update/delete of a review.
     */
    async recalculateStats(roomId: string): Promise<RoomRatingStat | null> {
        this.logger.log(`Recalculating stats for room: ${roomId}`);

        const result = await this.prisma.roomReview.aggregate({
            where: {
                roomId,
                status: 'VISIBLE',
            },
            _count: true,
            _avg: {
                ratingOverall: true,
                ratingClean: true,
                ratingLocation: true,
                ratingPrice: true,
                ratingService: true,
            },
        });

        const totalReviews = result._count;

        if (totalReviews === 0) {
            // No visible reviews - delete stats record
            await this.prisma.roomRatingStat.delete({
                where: { roomId },
            }).catch(() => {
                // Ignore if record doesn't exist
            });
            await this.redis.del(REDIS_KEY.ROOM_RATING_STATS(roomId));
            return null;
        }

        // Upsert stats
        const stats = await this.prisma.roomRatingStat.upsert({
            where: { roomId },
            update: {
                totalReviews,
                avgRating: new Prisma.Decimal(result._avg.ratingOverall ?? 0),
                avgClean: result._avg.ratingClean
                    ? new Prisma.Decimal(result._avg.ratingClean)
                    : null,
                avgLocation: result._avg.ratingLocation
                    ? new Prisma.Decimal(result._avg.ratingLocation)
                    : null,
                avgPrice: result._avg.ratingPrice
                    ? new Prisma.Decimal(result._avg.ratingPrice)
                    : null,
                avgService: result._avg.ratingService
                    ? new Prisma.Decimal(result._avg.ratingService)
                    : null,
            },
            create: {
                roomId,
                totalReviews,
                avgRating: new Prisma.Decimal(result._avg.ratingOverall ?? 0),
                avgClean: result._avg.ratingClean
                    ? new Prisma.Decimal(result._avg.ratingClean)
                    : null,
                avgLocation: result._avg.ratingLocation
                    ? new Prisma.Decimal(result._avg.ratingLocation)
                    : null,
                avgPrice: result._avg.ratingPrice
                    ? new Prisma.Decimal(result._avg.ratingPrice)
                    : null,
                avgService: result._avg.ratingService
                    ? new Prisma.Decimal(result._avg.ratingService)
                    : null,
            },
        });

        // Update cache
        await this.redis.set(
            REDIS_KEY.ROOM_RATING_STATS(roomId),
            stats,
            TTL.RATING_STATS,
        );

        this.logger.log(
            `Stats updated for room ${roomId}: ${totalReviews} reviews, avg ${result._avg.ratingOverall}`,
        );

        return stats;
    }

    /**
     * Get rating stats for a single room.
     */
    async getStats(roomId: string): Promise<RoomRatingStat | null> {
        // Check cache first
        const cached = await this.redis.get<RoomRatingStat>(
            REDIS_KEY.ROOM_RATING_STATS(roomId),
        );
        if (cached) {
            return cached;
        }

        const stats = await this.prisma.roomRatingStat.findUnique({
            where: { roomId },
        });

        if (stats) {
            await this.redis.set(
                REDIS_KEY.ROOM_RATING_STATS(roomId),
                stats,
                TTL.RATING_STATS,
            );
        }

        return stats;
    }

    /**
     * Get rating stats for multiple rooms (batch).
     * Useful for room listing pages.
     */
    async getStatsForRooms(roomIds: string[]): Promise<RoomRatingStat[]> {
        if (roomIds.length === 0) return [];

        // Try to get from cache first
        const cached: RoomRatingStat[] = [];
        const uncachedIds: string[] = [];

        for (const id of roomIds) {
            const stat = await this.redis.get<RoomRatingStat>(
                REDIS_KEY.ROOM_RATING_STATS(id),
            );
            if (stat) {
                cached.push(stat);
            } else {
                uncachedIds.push(id);
            }
        }

        if (uncachedIds.length === 0) {
            return cached;
        }

        // Fetch remaining from DB
        const dbStats = await this.prisma.roomRatingStat.findMany({
            where: { roomId: { in: uncachedIds } },
        });

        // Cache the results
        for (const stat of dbStats) {
            await this.redis.set(
                REDIS_KEY.ROOM_RATING_STATS(stat.roomId),
                stat,
                TTL.RATING_STATS,
            );
        }

        return [...cached, ...dbStats];
    }
}
