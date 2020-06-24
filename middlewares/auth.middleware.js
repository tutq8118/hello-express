const User = require('../models/user.model');

module.exports = {
  requireAuth: async (req, res, next) => {
    var userID = req.signedCookies.userID;
    var user = await User.findById(userID);
    
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