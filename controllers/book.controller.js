const Book = require('../models/book.model');
var cloudinary = require('cloudinary').v2;
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

module.exports = {
  index: async (request, response) => {
    const page = parseInt(request.query.page) || 1;
    const limit = parseInt(request.query.limit) || 8;
    const q = request.query.q || '';

    const totalBooks = await Book.find();
    const totalPage = Math.ceil(totalBooks.length / limit);
    const books = await Book.find({ title: { $regex: q, $options: 'i' } })
      .limit(limit)
      .skip(limit * (page - 1));
    response.render('books', {
      books,
      totalPage
    });
  },
  create: (request, response) => {
    const image = request.file;
    const title = request.body.title;
    const desc = request.body.desc;
    
    if (title !== null && title !== "") {
      if (image) {
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
      } else {
        Book.create({
          title: title,
          desc: desc,
          coverUrl: ''
        }).then(function(resolve) {
          response.redirect("back");
        });
      }
    }
    
  },
  remove: (request, response) => {
    const id = request.params.id;
    Book.findOneAndDelete({_id: id}, () => console.log('Done'));
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
      
  },

  search: async (req, res, next) => {
    const q = req.query.q;
    if (q) {
      const books = await Book.find({ title: { $regex: q, $options: 'i'}});
        res.render('books', {
          books
        })
    }
  }
}