const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var transactionSchema = new Schema({
    bookId: String,
    bookTitle: String,
    userEmail: String,
    count: Number,
    isCompleted: Boolean
})

var Transaction = mongoose.model('Transaction', transactionSchema, 'transactions');

module.exports = Transaction;