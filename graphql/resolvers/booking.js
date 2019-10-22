const Event = require('../../models/event');
const Booking = require('../../models/booking');
const { transformEvent, transformBooking } = require('./merge');

module.exports = {
  bookings: async (args, request) => {
    if (!request.isAuth) {
      throw new Error('Bookings Unauthenticated!');
    }

    try {
      const bookings = await Booking.find({ user: request.userId });
      return bookings.map(booking => transformBooking(booking));
    } catch (err) {
      throw err;
    }
  },

  bookEvent: async ({ eventId }, request) => {
    if (!request.isAuth) {
      throw new Error('Book event Unauthenticated!');
    }

    try {
      const event = await Event.findOne({ _id: eventId });
      const booking = new Booking({
        user: request.userId,
        event,
      });

      const result = await booking.save();

      return transformBooking(result);
    } catch (err) {
      throw err;
    }
  },

  cancelBooking: async ({ bookingId }, request) => {
    if (!request.isAuth) {
      throw new Error('Cancel booking Unauthenticated!');
    }

    try {
      const booking = await Booking.findById(bookingId).populate('event');

      const event = transformEvent(booking.event);
      await Booking.deleteOne({ _id: bookingId });

      return event;
    } catch (err) {
      throw err;
    }
  },
};
