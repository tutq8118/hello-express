
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);
var cloudinary = require('cloudinary').v2;
cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET 
});

const User = require('../models/user.model');

module.exports = {
  index: (req, res) => {
    res.render('profile');
  },
  update: async (req, res) => {
    const newName = req.body.name;
    const image = req.file;
    const curentUserEmail = res.locals.curentUserEmail;

    if (!image) {
      User.findOneAndUpdate(
        {email: curentUserEmail},
        {$set:{name: newName}},
        {new: true},
        (err, doc) => {
        if (err) {
            console.log("Something wrong when updating data!");
        }
        else {
          res.redirect('back');
        }
      });
    } else {
      cloudinary.uploader.upload(image.path, { folder: "hello-express/avatars/"}, 
        function(error, result) {
          User.findOneAndUpdate(
            {email: curentUserEmail},
            {$set:{avatarUrl: result.secure_url}},
            {new: true},
            (err, doc) => {
              if (err) {
                  console.log("Something wrong when updating data!");
              }
            });
        res.locals.avatarUrl = result.secure_url;
        res.redirect('back');
      });
    }
  }
}