const express = require("express");
const app = express();
const db = require('../db');

module.exports = {
  count: (req, res, next) => {
    console.log('<test>: ', `<${res.locals.count}>`);
    next();
  },
  check: (req, res, next) => {
    res.locals.isAdmin = false;
    res.locals.avatarUrl = 'https://cdn.glitch.com/0ded82f9-2581-4657-8e03-011ea567f797%2Fdefault-avatar.png';
    if (req.signedCookies.userID === null || req.signedCookies.userID === undefined) {
      next();
      return;
    }
    var currentUser = db.get('users').find({id: req.signedCookies.userID}).value();
    res.locals.curentUserEmail = currentUser.email;
    res.locals.isAdmin = currentUser.isAdmin;
    res.locals.userName = currentUser.name;
    if (currentUser.avatarUrl) {
      res.locals.avatarUrl = currentUser.avatarUrl;
    }
    next();
  }
}