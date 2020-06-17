const express = require("express");
const app = express();
const db = require('../db');
const shortid = require("shortid");
const { get } = require("../db");

module.exports = {
  check: (req, res, next) => {
    if (!req.signedCookies.sessionId) {
      var sessionId = shortid.generate();
      res.cookie('sessionId', sessionId, {
        signed: true
      });
      db.get('session').push({
        id: sessionId
      }).write();
      next();
    }

    var sessionId = req.signedCookies.sessionId;
    var sessionCart = db.get('session').find({id: sessionId}).get('cart').value();
    var sessionCartArr = Object.entries(sessionCart).map(function(e) {
      var bookId = String(e[0]);
      var bookTitle = db.get('books').find({id: bookId}).value().title;
      return [bookTitle, e[1]]
    });
    res.locals.sessionCartArr = sessionCartArr;
    next();
  }
}