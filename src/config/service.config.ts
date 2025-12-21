export default () => ({
    services: {
      user: process.env.USER_SERVICE_URL,
      room: process.env.ROOM_SERVICE_URL,
      booking: process.env.BOOKING_SERVICE_URL,
    },
  });
  