
const Session = require('../models/session.model');
const Transaction = require('../models/transaction.model');
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
    } else {
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
    });
    res.redirect('back');
  },
  
  checkout: async (req, res, next) => {
    var sessionId = req.signedCookies.sessionId;
    if (!sessionId) {
      res.redirect('back');
      return;
    }

    var sessionCart = req.sessionCart;
    console.log(sessionCart);
    if (res.locals.totalCart) {
      for (const item of sessionCart) {
        console.log(item);
        Transaction.create({
          bookId: item.bookId,
          bookTitle: item.bookTitle,
          userEmail: res.locals.curentUserEmail,
          count: item.count,
          isCompleted: false
        }).then((resolve) => console.log('done'));
      }
    }
    Session.findOneAndUpdate({_id: sessionId}, {$set:{cart: []}}, {new: true}, (err, doc) => {
        if (err) {
            console.log("Something wrong when updating data!");
        }
    });
    var transactions = await Transaction.find();
    res.render('transactions', {
      transactions,
      messengers: ['Checkout Success!'],
    });
  }
}