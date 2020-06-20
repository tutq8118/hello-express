const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var userSchema = new Schema({
    name: String,
    password: String,
    email: String,
    wrongLoginCount: Number,
    isAdmin: Boolean,
    avatarUrl: String
})

var User = mongoose.model('User', userSchema, 'users');

module.exports = User;