const User = require('../../models/user');
const bycrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

module.exports = {
  createUser: async ({ userInput: { email, password } }) => {
    try {
      const existedUser = await User.findOne({ email });
      if (existedUser) {
        throw new Error('User exist');
      }
      const hashedPassword = await bycrypt.hash(password, 12);
      const newUser = new User({
        email,
        password: hashedPassword,
      });
      const res = await newUser.save();
      return {
        ...res._doc,
        password: null,
      };
    } catch (err) {
      throw err;
    }
  },

  login: async ({ email, password }) => {
    const user = await User.findOne({ email });
    if (!user) {
      throw new Error('User not exist');
    }

    const isEqual = await bycrypt.compare(password, user.password);

    if (!isEqual) {
      throw new Error('Invalid password');
    }

    const token = jwt.sign(
      { userId: user.id, email: user.email },
      'secretkey',
      {
        expiresIn: '1h',
      }
    );

    return {
      userId: user.id,
      token,
      tokenExpiration: 1,
    };
  },
};
