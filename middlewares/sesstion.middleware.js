const mongoose = require('mongoose');
const Session = require('../models/session.model');

module.exports = {
  check: async (req, res, next) => {
    if (!req.signedCookies.sessionId) {
      var sessionId = mongoose.Types.ObjectId();
      res.cookie('sessionId', sessionId, {
        signed: true
      });
      try {
        var newSession = new Session({
          _id: sessionId,
          cart: [],
        });
        var saveSession = await newSession.save();
        console.log('save done');

      } catch (err) {
        console.log('error:', err);
        res.status(500).send(err);
      }
      next();
      return;
    }

    var sessionId = req.signedCookies.sessionId;
    var data = await Session.findById(sessionId);
    if (!data) {
      next();
      return;
    }
    var sessionCart = data.cart;
    if (!sessionCart) {
      next();
      return;
    }
    var total = sessionCart.reduce((acc, curr) => acc + curr.count, 0);
    req.sessionCart = sessionCart;
    res.locals.totalCart = total;
    res.locals.sessionCart = sessionCart;
    next();
    
  }
}