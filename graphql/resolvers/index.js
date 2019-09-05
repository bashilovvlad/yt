const events = require('./events');
const auth = require('./auth');
const booking = require('./booking');

module.exports = {
  ...auth,
  ...events,
  ...booking,
};
