const db = require('../db');
const md5 = require('md5');
const bcrypt  = require('bcrypt');

module.exports = {
  login: (req, res) => {
    res.render('auth/login');
  },
  postLogin: (req, res) => {
    var email = req.body.email;
    var password = req.body.password;
    var hashedPassword = md5(password);
    var user = db.get('users').find({email: email}).value();
    
    if (!user) {
      res.render('auth/login', {
        errors: [
          "Doesn't exits this email"
        ]
      });
      return;
    }
    if (user.wrongLoginCount > 2) {
      res.render('auth/login', {
        errors: [
          "Your account is temporarily locked because your password was wrong over 4 times. Please contact us to unlock"
        ]
      });
      return;
    }

    if (!bcrypt.compareSync(password, user.password)) {     
      user.wrongLoginCount ++;
      res.render('auth/login', {
        errors: [
          `Wrong password! You have ${4 - user.wrongLoginCount} ${user.wrongLoginCount> 2? 'time' : 'times'} to try`
        ]
      });
      return;
    }

    user.wrongLoginCount = 0;
    
    // Async 
    // bcrypt.compare(password, user.password, function(err, result) {
    //   if (!result) {
    //     res.render('auth/login', {
    //       errors: [
    //         "Wrong password"
    //       ]
    //     });
    //     return;
    //   }
    // });

    res.cookie('userID', user.id);
    res.redirect('/users');
  }
}