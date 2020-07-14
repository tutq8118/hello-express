const Book = require('../../models/book.model');
var cloudinary = require('cloudinary').v2;
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

module.exports = {
  index: async (request, response) => {
    const page = parseInt(request.query.page) || 1;
    const limit = parseInt(request.query.limit) || 8;
    const q = request.query.q || '';

    const totalBooks = await Book.find();
    const totalFilteredBooks = await Book.find({ title: { $regex: q, $options: 'i' } });
    const totalPage = Math.ceil(totalBooks.length / limit);
    const books = await Book.find()
      .limit(limit)
      .skip(limit * (page - 1));
    const filteredBooks = await Book.find({ title: { $regex: q, $options: 'i' } })
      .limit(limit)
      .skip(limit * (page - 1));
    const fillteredTotalPage = Math.ceil(totalFilteredBooks.length / limit)

    response.json({
      books: books,
      filteredBooks: filteredBooks,
      limit: limit,
      page: page,
      q: q,
      totalPage: totalPage,
      fillteredTotalPage: fillteredTotalPage,
      fillteredAmount: totalFilteredBooks.length,
      totalAmount: totalBooks.length
    });
  },
};
