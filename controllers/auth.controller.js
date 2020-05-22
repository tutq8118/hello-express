const db = require('../db');
const shortid = require("shortid");
const users = db.get("users").value();

module.exports = {
  login: (req, res) => {
    res.render('auth/login');
  },
  postLogin: (req, res) => {
    var email = req.body.email;
    var password = req.body.password;
    var user = db.get('users').find({email: email}).value();
    if (!user) {
      res.render('auth/login', {
        errors: [
          "Doesn't exits this email"
        ]
      });
      return;
    }
    if (password !== user.password) {
      res.render('auth/login', {
        errors: [
          "Wrong password"
        ]
      });
      return;
    }
    res.cookie('userID', user.id);
    res.redirect('/users');
  }
}