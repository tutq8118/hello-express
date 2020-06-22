const db = require('../db');
const shortid = require("shortid");
const users = db.get("users").value();
const Session = require('../models/session.model');

module.exports = {
  add: async (req, res, next) => {
    var bookId = req.params.id;
    var sessionId = req.signedCookies.sessionId;
    if (!sessionId) {
      res.redirect('/books');
      return;
    }
    // var count = db.get('session').find({id: sessionId}).get('cart.' + bookId, 0).value();
    var cart = await Session.findById(sessionId);
    var count = cart.bookId ? cart.bookId : 0;
    cart.bookId = count + 1;
    Session.findByIdAndUpdate(
      {_id: sessionId},
      {cart: cart},
      r => {
        res.redirect('/books');
      }
    )
    // db.get('session')
    //   .find({id: sessionId})
    //   .set("cart." + bookId, count + 1)
    //   .write();
    
  },
  
  checkout: (req, res, next) => {
    var sessionId = req.signedCookies.sessionId;
    if (!sessionId) {
      res.redirect('/books');
      return;
    }

    var sessionCart = req.sessionCart;
    
    if (res.locals.totalCart) {
      for (var k in sessionCart) {
        db.get("transactions")
        .push({
          id: shortid.generate(),
          bookTitle: db.get('books').find({id: k}).value().title,
          userEmail: res.locals.curentUserEmail,
          isCompleted: false
        })
        .write();
        db.get('session').find({id: sessionId}).get('cart').unset(k).write();
      }
    }
    res.redirect('/books');
  }
}