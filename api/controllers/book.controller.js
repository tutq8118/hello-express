const Book = require('../../models/book.model');
var cloudinary = require('cloudinary').v2;
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

module.exports = {
  index: async (request, response) => {
    const books = await Book.find();
    response.json(books);
  },
  create: (request, response) => {
    const title = request.body.title;
    const desc = request.body.desc;
    if (title !== null && title !== "") {
      db.get("books")
        .push({
          id: shortid.generate(),
          title: title,
          desc: desc
        })
        .write();
    }
    response.redirect("back");
  },
  remove: (request, response) => {
    db.get("books")
      .remove({
        id: request.params.id
      })
      .write();
    response.redirect("back");
  },
  edit: (request, response) => {
    const id = request.params.id;
    const book = db
      .get("books")
      .find({
        id: id
      })
      .value();
    response.render("books/edit", {
      book
    });
  },
  update: (request, response) => {
    const id = request.params.id;
    const newTitle = request.body.title;
    const newDesc = request.body.desc;
    const image = request.file;
    db.get("books")
      .find({
        id: id
      })
      .assign({
        title: newTitle,
        desc: newDesc
      })
      .write();
    // response.redirect("/books");

    cloudinary.uploader.upload(image.path, {
        folder: "hello-express/covers/"
      },
      function (error, result) {
        db.get('books')
          .find({
            id: id
          })
          .assign({
            coverUrl: result.secure_url
          }).write();
        response.redirect('back');

      });
  }
}