const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var sessionSchema = new Schema({
    cart: { type : Array , "default" : [] }
})

var Session = mongoose.model('Session', sessionSchema, 'sessions');

module.exports = Session;