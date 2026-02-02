import { RoomReview } from '@prisma/client';

/**
 * Review with enriched user information.
 */
export interface ReviewWithUser extends RoomReview {
    user?: {
        id: string;
        name: string;
        avatar?: string | null;
    };
}

/**
 * Generic paginated response type.
 */
export interface PaginatedResponse<T> {
    data: T[];
    nextCursor: string | null;
    hasMore: boolean;
    total?: number;
}

/**
 * Booking info from external service.
 */
export interface BookingInfo {
    id: string;
    userId: string;
    roomId: string;
    status: string;
    checkIn: Date;
    checkOut: Date;
}

/**
 * User info from external service.
 */
export interface UserInfo {
    id: string;
    name: string;
    email: string;
    avatar?: string | null;
}
