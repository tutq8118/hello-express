const express = require("express");
const app = express();
const db = require('../db');
const shortid = require("shortid");
const { get } = require("../db");
const mongoose = require('mongoose');
const Session = require('../models/session.model');
const Book = require('../models/book.model');

module.exports = {
  check: (req, res, next) => {
    if (!req.signedCookies.sessionId) {
      var sessionId = mongoose.Types.ObjectId();
      res.cookie('sessionId', sessionId, {
        signed: true
      });
      var newSession = new Session({
        _id: sessionId,
        cart: []
      });
      newSession.save().then((r) => {
        if (r) {
          console.log(r);
        }
        
        
      });

      next();
      return;
     
    }

    var sessionId = req.signedCookies.sessionId;
    // var sessionCart = db.get('session').find({id: sessionId}).get('cart').value();
    var sessionCart = [];
    Session.findById(sessionId).then((data) => {
      sessionCart = data.cart;

      if (!sessionCart) {
        next();
        return;
      }

      var sessionCartArr = Object.entries(sessionCart).map(function(e) {
        var bookId = String(e[0]);
        // var bookTitle = db.get('books').find({id: bookId}).value().title;
        Book.findById(bookId).then((data) => {
          
        })
        return [data.title, e[1]]
      });

      var total = 0;
      for (var k in sessionCart) {
        total += sessionCart[k];
      }
      req.sessionCart = sessionCart;
      res.locals.totalCart = total;
      res.locals.sessionCartArr = sessionCartArr;
      next();
    });
    
    
  }
}