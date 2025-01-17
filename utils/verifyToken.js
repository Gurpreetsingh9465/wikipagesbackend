const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const token = req.query.token || req.cookies.token; // query is for email cookie is for auth
  if (!token) {
    return res.status(401).json({error: 'No token provided'});
  } else {
    jwt.verify(token, process.env.KEY, (err, decoded) => {
      if (err) {
        return res.status(401).json({error: 'Invalid token'});
      } else {
        req._id = decoded._id;
        next();
      }
    });
  }
}