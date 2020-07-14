const Book = require('../../models/book.model');

module.exports = {
  index: async (request, response) => {
   
    const books = await Book.find().sort({ _id: -1 }).limit(8);
    response.json({
      books,
    });
  }
}