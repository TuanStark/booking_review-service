export const REDIS_KEY = {
    USER: (id: number) => `user:${id}`,
    ROOM: (id: number) => `room:${id}`,
    BOOKING: (id: number) => `booking:${id}`,
  };
  