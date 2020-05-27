const express = require("express");
const db = require('../db');
const shortid = require("shortid");
const md5 = require('md5');
const bcrypt  = require('bcrypt');
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);
var cloudinary = require('cloudinary').v2;
cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET 
});

module.exports = {
  index: (req, res) => {
    res.render('profile');
  },
  update: (req, res) => {
    const newName = req.body.name;
    const image = req.file;
    const curentUserEmail = req.signedCookies.userID !== null && req.signedCookies.userID !== undefined ? 
    db.get('users').find({id: req.signedCookies.userID}).value().email : '';
    if (newName !== '' && db.get('users').find({email: curentUserEmail}).value().name !== newName) {
      db.get('users')
      .find({email: curentUserEmail})
      .assign({ 
        name: newName
      }).write();
    }
    cloudinary.uploader.upload(image.path, { folder: "hello-express/avatars/"}, 
      function(error, result) {
        db.get('users')
        .find({email: curentUserEmail})
        .assign({ 
          avatarUrl: result.secure_url
        }).write();
        res.locals.avatarUrl = result.secure_url;
        res.redirect('back');

    });
    
  }
}