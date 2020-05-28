const express = require("express");
const app = express();
const db = require('../db');

module.exports = {
  count: (req, res, next) => {
    console.log('<test>: ', `<${res.locals.count}>`);
    next();
  },
  check: (req, res, next) => {
    const avartaUrl = db.get('users').find({id: req.signedCookies.userID}).value().avatarUrl;
    res.locals.curentUserEmail = req.signedCookies.userID !== null && req.signedCookies.userID !== undefined ? db.get('users').find({id: req.signedCookies.userID}).value().email : '';
    res.locals.isAdmin = req.signedCookies.userID !== null && req.signedCookies.userID !== undefined ? db.get('users').find({id: req.signedCookies.userID}).value().isAdmin : false;
    res.locals.userName = req.signedCookies.userID !== null && req.signedCookies.userID !== undefined? db.get('users').find({id: req.signedCookies.userID}).value().name: null;
    res.locals.avatarUrl = avartaUrl !== null && avartaUrl !== undefined && avartaUrl !== '' ? avartaUrl : 'https://cdn.glitch.com/0ded82f9-2581-4657-8e03-011ea567f797%2Fdefault-avatar.png';
    next();
  }
}