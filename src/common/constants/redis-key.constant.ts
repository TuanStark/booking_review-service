export const REDIS_KEY = {
  USER: (id: number) => `user:${id}`,
  ROOM: (id: number) => `room:${id}`,
  BOOKING: (id: number) => `booking:${id}`,
  ROOM_REVIEWS: (roomId: string) => `room-reviews:${roomId}`,
  ROOM_RATING_STATS: (roomId: string) => `room-rating-stats:${roomId}`,
};
