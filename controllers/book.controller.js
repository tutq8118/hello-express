const db = require('../db');
const Book = require('../models/book.model');
const shortid = require("shortid");
const User = require('../models/user.model');
var cloudinary = require('cloudinary').v2;
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

module.exports = {
  index: async (request, response) => {
    // var page = request.query.page || 1;
    // var perPage = 8;
    // var start = (page - 1) * perPage;
    // var end = page * perPage;
    // const totalPage = Math.floor(db.get("books").value().length / perPage) + 1;

    const books = await Book.find();
    console.log(books);
    response.render("books", {
      books
    });
  },
  create: (request, response) => {
    const image = request.file;
    const title = request.body.title;
    const desc = request.body.desc;
    
    if (title !== null && title !== "") {
     
      cloudinary.uploader.upload(image.path, { folder: "hello-express/cover/"}, 
      function(error, result) {
        Book.create({
          title: title,
          desc: desc,
          coverUrl: result.secure_url
        }).then(function(resolve) {
          response.redirect("back");
        });
      });
    }
    
    
  },
  remove: (request, response) => {
    Book.findOneAndDelete(request.params.id);
    response.redirect("back");
  },
  edit: (request, response) => {
    const id = request.params.id;
    Book.find({
      _id: id
    }).then(r => {
      const book = r[0];
      response.render('books/edit', {
        book
      })
    }); 
    
  },
  update: (request, response) => {
    const id = request.params.id;
    const newTitle = request.body.title;
    const newDesc = request.body.desc;
    const image = request.file;

      if (image) {
          cloudinary.uploader.upload(image.path, { 
            folder: "hello-express/cover/"
          }, 
          function(error, result) {
            Book.findByIdAndUpdate(
              { _id: id },
              { title: newTitle,
                desc: newDesc,
                coverUrl: result.secure_url },
              r => {
                response.redirect('back');
              }
            );
        });
      }
      else {
        Book.findOneAndUpdate(
          { _id: id },
          { $set: request.body },
          { new: true },
          r => {
            response.redirect('back');
          }
        );
      }
      
  }
}