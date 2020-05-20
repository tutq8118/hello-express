// server.js
// where your node app starts

// we've started you off with Express (https://expressjs.com/)
// but feel free to use whatever libraries or frameworks you'd like through `package.json`.
const express = require("express");
const app = express();

const cookieParser = require('cookie-parser')

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));

const usersRoute = require('./routes/user.route');
const booksRoute = require('./routes/book.route');
const transactionsRoute = require('./routes/transaction.route');
const cookieMiddleware = require('./middlewares/cookie.middleware');

app.set("view engine", "pug");
app.set("views", "./views");

app.use(cookieParser());
app.use(express.static('public'));

app.use('/users', cookieMiddleware.visit, usersRoute);
app.use('/books', cookieMiddleware.visit, booksRoute);
app.use('/transactions', cookieMiddleware.visit, transactionsRoute);

app.get("/", cookieMiddleware.visit, (request, response) => {
  response.render("");
});

// listen for requests :)
const listener = app.listen(process.env.PORT, () => {
  console.log("Your app is listening on port " + listener.address().port);
});
