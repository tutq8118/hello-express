const db = require('../db');
const shortid = require("shortid");
const users = db.get("users").value();
const Session = require('../models/session.model');
const Book = require('../models/book.model');

module.exports = {
  add: async (req, res, next) => {
    var bookId = req.params.id;
    var sessionId = req.signedCookies.sessionId;
    if (!sessionId) {
      res.redirect('/books');
      return;
    }
    // var count = db.get('session').find({id: sessionId}).get('cart.' + bookId, 0).value();
    var book = await Book.findById(bookId);
    var data = await Session.findById(sessionId);
    var cart = data.cart;
    
    // var check = cart.find((e) => {
    //   return Object.keys(e)[0] === bookId
    // });
    console.log(cart.length);
    var count = cart.length ? cart.find((e) => Object.keys(e)[0] === bookId)[0].bookId : 0;
    var  a = [];
    var temp = a.push({
      "book_id": bookId,
      "count": count + 1
    });
    console.log(temp);
    Session.findOneAndUpdate({_id: sessionId}, {$set:{cart: a}}, {new: true}, (err, doc) => {
        if (err) {
            console.log("Something wrong when updating data!");
        }
    
        console.log(doc);
    });
    res.redirect('/books');
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