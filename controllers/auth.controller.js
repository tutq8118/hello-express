const db = require('../db');
const md5 = require('md5');

module.exports = {
  login: (req, res) => {
    res.render('auth/login');
  },
  postLogin: (req, res) => {
    var email = req.body.email;
    var password = req.body.password;
    var hashedPassword = md5(password);
    console.log(md5('123123'));
    var user = db.get('users').find({email: email}).value();
    if (!user) {
      res.render('auth/login', {
        errors: [
          "Doesn't exits this email"
        ]
      });
      return;
    }
    if (hashedPassword !== user.password) {
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