import { RoomReview, ReviewStatus } from '@prisma/client';

/**
 * Response DTO for a single review with optional user info.
 */
export class ReviewResponseDto {
    id: string;
    roomId: string;
    userId: string;
    bookingId: string;
    ratingOverall: number;
    ratingClean?: number | null;
    ratingLocation?: number | null;
    ratingPrice?: number | null;
    ratingService?: number | null;
    comment?: string | null;
    status: ReviewStatus;
    createdAt: Date;
    updatedAt: Date;
    user?: {
        id: string;
        name: string;
        avatar?: string | null;
    };

    static fromEntity(review: RoomReview, user?: any): ReviewResponseDto {
        return {
            id: review.id,
            roomId: review.roomId,
            userId: review.userId,
            bookingId: review.bookingId,
            ratingOverall: review.ratingOverall,
            ratingClean: review.ratingClean,
            ratingLocation: review.ratingLocation,
            ratingPrice: review.ratingPrice,
            ratingService: review.ratingService,
            comment: review.comment,
            status: review.status,
            createdAt: review.createdAt,
            updatedAt: review.updatedAt,
            user: user
                ? { id: user.id, name: user.name, avatar: user.avatar }
                : undefined,
        };
    }
}

/**
 * Paginated response for reviews list.
 */
export class PaginatedReviewsResponseDto {
    data: ReviewResponseDto[];
    nextCursor: string | null;
    hasMore: boolean;
    total?: number;

    static create(
        reviews: ReviewResponseDto[],
        nextCursor: string | null,
        hasMore: boolean,
        total?: number,
    ): PaginatedReviewsResponseDto {
        return {
            data: reviews,
            nextCursor,
            hasMore,
            total,
        };
    }
}
