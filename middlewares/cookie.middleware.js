const express = require("express");
const app = express();
const db = require('../db');

module.exports = {
  count: (req, res, next) => {
    console.log('<test>: ', `<${res.locals.count}>`);
    next();
  },
  check: (req, res, next) => {
    res.locals.curentUserEmail = req.cookies.userID !== null && req.cookies.userID !== undefined ? db.get('users').find({id: req.cookies.userID}).value().email : '';
    res.locals.isAdmin = req.cookies.userID !== null && req.cookies.userID !== undefined ? db.get('users').find({id: req.cookies.userID}).value().isAdmin : false;
    next();
  }
}