const Event = require('../../models/event');
const User = require('../../models/user');

const { dateToString } = require('../../helpers/date');

const events = async ids => {
  try {
    const events = await Event.find({ _id: { $in: ids } });
    return events.map(event => ({
      ...event._doc,
      creator: user.bind(this, event._doc.creator),
      date: dateToString(event._doc.date),
    }));
  } catch (err) {
    throw err;
  }
};

const user = async id => {
  try {
    const user = await User.findById(id);
    return {
      ...user._doc,
      createdEvents: events.bind(this, user._doc.createdEvents),
    };
  } catch (err) {
    throw err;
  }
};

const singleEvent = async id => {
  try {
    const event = await Event.findById(id);
    return transformEvent(event);
  } catch (err) {
    throw err;
  }
};

const transformBooking = booking => {
  return {
    ...booking._doc,
    33: 33,
    user: user.bind(this, booking._doc.user),
    event: singleEvent.bind(this, booking._doc.event),
    createdAt: dateToString(booking._doc.createdAt),
    updatedAt: dateToString(booking._doc.updatedAt),
  };
};

const transformEvent = event => {
  return {
    ...event._doc,
    creator: user.bind(this, event._doc.creator),
    date: dateToString(event._doc.date),
    //   _id: event.id,
    //   _id: event._doc._id.toString(),
  };
};

// exports.user = user;
// exports.singleEvent = singleEvent;
// exports.events = events;

exports.transformBooking = transformBooking;
exports.transformEvent = transformEvent;
