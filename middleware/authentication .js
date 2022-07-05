const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
  // find token in header
  const token =
    req.body.token || req.query.token || req.headers['x-access-token'];
  // if token is not found
  if (!token) {
    return res
      .status(401)
      .send(`Please login first <a href="/login">Login</a>`);
  }
  // if token is found verify it
  try {
    const decoded = jwt.verify(token, process.env.TOKEN_KEY);
    // if token is valid
    req.user = decoded;
  } catch (error) {
    return res.status(400).send(`Invalid token`);
  }
  // if token is valid continue to next middleware
  return next();
};

module.exports = verifyToken;
