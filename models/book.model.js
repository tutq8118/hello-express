const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var bookSchema = new Schema({
    title: String,
    desc: String,
    coverUrl: String
})

var Book = mongoose.model('Book', bookSchema, 'books');

module.exports = Book;