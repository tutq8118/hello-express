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
  }
}