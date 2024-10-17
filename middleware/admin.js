const user = require('../models/user');

const isAdmin = (req, res, next) => {
  if (req.user && req.user.is_admin) {
    next();
  } else {
    return res.status(403).json({ message: 'Forbidden: Unauthorized' });
  }
};

module.exports = isAdmin;
