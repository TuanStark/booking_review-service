export const REDIS_KEY = {
  USER: (id: number | string) => `user:${id}`,
  ROOM: (id: number | string) => `room:${id}`,
  BOOKING: (id: number | string) => `booking:${id}`,
  ROOM_REVIEWS: (roomId: string) => `room-reviews:${roomId}`,
  ROOM_RATING_STATS: (roomId: string) => `room-rating-stats:${roomId}`,
};
