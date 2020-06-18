const db = require('../db');
const shortid = require("shortid");
const users = db.get("users").value();

module.exports = {
  add: (req, res, next) => {
    var bookId = req.params.id;
    var sessionId = req.signedCookies.sessionId;
    if (!sessionId) {
      res.redirect('/books');
      return;
    }
    var count = db.get('session').find({id: sessionId}).get('cart.' + bookId, 0).value();
    db.get('session')
      .find({id: sessionId})
      .set("cart." + bookId, count + 1)
      .write();
    res.redirect('/books');
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