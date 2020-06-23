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
    var book = await Book.findById(bookId);
    var data = await Session.findById(sessionId);
    var cart = data.cart;
    var temp = [...cart];
    var checkArr = temp.find((el) => el.bookId === bookId);
    if (!checkArr) {
      temp.push({
        bookId: bookId,
        bookTitle: book.title,
        count: 1
      });
    }
    else {
      temp.forEach((el) => {
        if (el.bookId === bookId) {
          el.count++
        }
      })
    }
    
    Session.findOneAndUpdate({_id: sessionId}, {$set:{cart: temp}}, {new: true}, (err, doc) => {
        if (err) {
            console.log("Something wrong when updating data!");
        }
    
        console.log(doc);
    });
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