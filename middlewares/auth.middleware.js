const db = require('../db');

module.exports = {
  requireAuth: (req, res, next) => {
    var userID = req.cookies.userID;
    var user = db.get('users').find({id: userID});

    if (!userID) {
      res.redirect('/auth/login');
      return;
    }

    if (!user) {
      res.redirect('/auth/login');
      return;
    }
    next();
  }
}