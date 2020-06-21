const express = require("express");
const app = express();
const db = require('../db');
const shortid = require("shortid");
const { get } = require("../db");

const Session = require('../models/session.model');

module.exports = {
  check: async (req, res, next) => {
    if (!req.signedCookies.sessionId) {
      var newSection = new Session();
      newSection.save((err) => {
        if (err) {
          console.log(err);
        }
        else {
          req.locals.sessionId = newSection._id;
          console.log('successfully');
        }
      });
      res.cookie('sessionId', req.locals.sessionId, {
        signed: true
      });
      next();
      return;
    }

    var sessionId = req.signedCookies.sessionId;
    console.log(req.signedCookies);
    // var sessionCart = db.get('session').find({id: sessionId}).get('cart').value();

    try {
      var sessionCart = await Session.find({
        _id: sessionId
      });
    } catch (err) {
      console.log(err);
    }
    console.log(sessionCart);
    return

    // console.log(sessionCart);
    // Session.find({
    //   _id: sessionId
    // }).then((r) => {
    //   console.log(1);
    // });

    // const sessionCart = r[0].cart;

    if (!sessionCart) {
      next();
      return;
    }

    var sessionCartArr = Object.entries(sessionCart).map(function(e) {
      var bookId = String(e[0]);
      var bookTitle = db.get('books').find({id: bookId}).value().title;
      return [bookTitle, e[1]]
    });

    var total = 0;
    for (var k in sessionCart) {
      total += sessionCart[k];
    }
    req.sessionCart = sessionCart;
    res.locals.totalCart = total;
    res.locals.sessionCartArr = sessionCartArr;
    next();
    
  }
}