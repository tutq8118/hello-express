const bcrypt = require('bcrypt');
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const User = require('../../models/user.model');


module.exports = {
  login: (req, res) => {
    res.render('auth/login');
  },
  logout: (req, res) => {
    res.clearCookie("userID");
    res.redirect('/auth/login');
  },
  create: async (req, res) => {
    const name = req.body.name;
    const email = req.body.email;
    const pwd = req.body.pwd;
    const saltRounds = 10;
    const salt = bcrypt.genSaltSync(saltRounds);
    const hashPwd = bcrypt.hashSync(pwd, salt);

    if (pwd !== null && pwd !== "") {
      User.create({
        name: name ? name : email.substring(0, email.lastIndexOf("@")),
        password: hashPwd,
        email: email,
        wrongLoginCount: 0,
        isAdmin: false,
        avatarUrl: ''
      }).then((doc) => {
        res.cookie('userID', doc._id, {
          signed: true
        });
        res.redirect("/");
      });
    }
  },

  postLogin: async (req, res) => {
    var email = req.body.email;
    var password = req.body.password;

    try {
      var userArr = await User.find({
        email: email
      });
    } catch (err) {
      console.log(err);
    }

    var user = userArr[0];
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
      const errors = [
        "Doesn't exits this email"
      ];
      res.json(errors);
      return;
    }

    if (user.wrongLoginCount === 2) {
      user.wrongLoginCount++;
      sgMail.send(msg).then(() => {
        console.log('Message sent')
      }).catch((error) => {
        console.log(error.response.body);
      });
      
      const errors =  [
        `Wrong password! Please check your email`
      ];
      res.json(errors);
      return;
    }

    if (user.wrongLoginCount > 2) {
      const errors = [
        "Your account is temporarily locked because your password was wrong over 4 times. Please contact us to unlock"
      ];

      res.json(errors);
      return;
    }

    if (!bcrypt.compareSync(password, user.password)) {
      user.wrongLoginCount++;
      const errors = [
        `Wrong password! You have ${4 - user.wrongLoginCount} ${user.wrongLoginCount> 2? 'time' : 'times'} to try`
      ];
      res.json(errors);
      return;
    }
    user.wrongLoginCount = 0;
    res.cookie('userID', user.id, {
      signed: true
    });
    res.json({
      email: email
    });
  }
}