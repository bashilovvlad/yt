const jwt = require('jsonwebtoken');

// call every time when make request
module.exports = (req, res, next) => {
  const authHeader = req.get('Authorization');

  if (!authHeader) {
    req.isAuth = false;
    return next();
  }

  // token which we set when make request
  const token = authHeader.split(' ')[1];

  if (!token || token === '') {
    req.isAuth = false;
    return next();
  }
  let decodedToken;
  try {
    decodedToken = jwt.verify(token, 'secretkey');
  } catch (err) {
    req.isAuth = false;
    return next();
  }
  if (!decodedToken) {
    req.isAuth = false;
    return next();
  }

  // take userId from token which is created previously in
  // const token = jwt.sign(
  //   { userId: user.id, email: user.email },
  //   'secretkey',
  //   {
  //     expiresIn: '10h',
  //   }
  // );
  req.isAuth = true;
  req.userId = decodedToken.userId;
  next();
};
