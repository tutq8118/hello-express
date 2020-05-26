const db = require('../db');
const shortid = require("shortid");
const md5 = require('md5');
const bcrypt  = require('bcrypt');
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);


module.exports = {
  login: (req, res) => {
    res.render('auth/login');
  },
  logout: (req, res) => {
    res.clearCookie("userID");
    res.redirect('/auth/login');
  },
  create: (req, res) => {
    const name = req.body.name;
    const email = req.body.email;
    const pwd = req.body.pwd;
    const saltRounds = 10;
    const salt = bcrypt.genSaltSync(saltRounds);
    const hashPwd = bcrypt.hashSync(pwd, salt);
    if (pwd !== null && pwd !== "") {
      db.get("users")
        .push({
          id: shortid.generate(),
          name: name ? name: email.substring(0, email.lastIndexOf("@")),
          password: hashPwd,
          email: email,
          wrongLoginCount: 0,
          isAdmin: false
        })
        .write();
      const user = db.get('users').find({email: email}).value();
      res.cookie('userID', user.id, {
        signed: true
      });
      res.redirect("/");
    }
  },
  postLogin: (req, res) => {
    var email = req.body.email;
    var password = req.body.password;
    var hashedPassword = md5(password);
    var user = db.get('users').find({email: email}).value();
    
    res.locals.email = email;
    res.locals.password = password;

    const msg = {
      to: email,
      from: 'trtu81@gmail.com',
      subject: 'Regarding account security',
      text: 'HelloExpress',
      html: 'You have typed wrong password 3 times. Please click <a href="#">here</a> to reset password',
    };
    
    if (!user) {
      res.render('auth/login', {
        errors: [
          "Doesn't exits this email"
        ]
      });
      return;
    }
    if (user.wrongLoginCount === 2) {
      user.wrongLoginCount ++;
      sgMail.send(msg).then(() => {
          console.log('Message sent')
      }).catch((error) => {
          console.log(error.response.body);
      });
      res.render('auth/login', {
        errors: [
          `Wrong password! Please check your email`
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
    
    res.cookie('userID', user.id, {
      signed: true
    });
    res.redirect('/');
  }
}