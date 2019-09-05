const Event = require('../../models/event');
const User = require('../../models/user');
const { transformEvent } = require('./merge');

module.exports = {
  events: () =>
    Event.find()
      .then(events => {
        return events.map(event => transformEvent(event));
      })
      .catch(err => {
        throw err;
      }),

  createEvent: async (
    { eventInput: { title, description, price, date } },
    request
  ) => {
    if (!request.isAuth) {
      throw new Error('Create event Unauthenticated!');
    }

    const event = new Event({
      title,
      description,
      price,
      date: new Date(date),
      creator: request.userId,
    });

    try {
      const result = await event.save();
      const creator = await User.findById(request.userId);
      if (!creator) {
        throw new Error('User not found');
      }
      creator.createdEvents.push(event);
      await creator.save();
      return transformEvent(result);
    } catch (err) {
      throw err;
    }
  },
};
