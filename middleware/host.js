const user = require('../models/user');

const isHost = (req, res, next) => {
  if (req.user && req.user.is_host) {
    next();
  } else {
    return res.status(403).json({ message: 'User is not a host' });
  }
};

module.exports = isHost;
