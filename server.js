// server.js
// where your node app starts

// we've started you off with Express (https://expressjs.com/)
// but feel free to use whatever libraries or frameworks you'd like through `package.json`.
require('dotenv').config();
const express = require("express");
const app = express();
const port = process.env.PORT || 8080;

// MongoDB

const mongoose = require('mongoose');
mongoose.connect(process.env.MONGODB_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const cookieParser = require('cookie-parser')

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({
  extended: true
}));

const usersRoute = require('./routes/user.route');
const booksRoute = require('./routes/book.route');
const transactionsRoute = require('./routes/transaction.route');
const authRoute = require('./routes/auth.route');
const profileRoute = require('./routes/profile.route');
const cartRoute = require('./routes/cart.route');
const indexRoute = require('./routes/index.route');

const apiIndexRoute = require('./api/routes/index.route');
const apiBooksRoute = require('./api/routes/book.route');
const apiAuthRoute = require('./api/routes/auth.route');
const apiTransactionsRoute = require('./api/routes/transaction.route');

const authMiddleware = require('./middlewares/auth.middleware');
const cookieMiddleware = require('./middlewares/cookie.middleware');
const sesstionMiddleware = require('./middlewares/sesstion.middleware');

app.set("view engine", "pug");
app.set("views", "./views");

app.use(cookieParser(process.env.SESSION_SECRET));
app.use(express.static('public'));

app.use(cookieMiddleware.check);
app.use(sesstionMiddleware.check);

app.use((req, res, next) => {
  res.append('Access-Control-Allow-Origin', ['*']);
  res.append('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.append('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

app.use('/', indexRoute);
app.use('/users', authMiddleware.requireAuth, usersRoute);
app.use('/books', booksRoute);
app.use('/transactions', authMiddleware.requireAuth, transactionsRoute);
app.use('/auth', authRoute);
app.use('/profile', profileRoute);
app.use('/cart', cartRoute);

app.use('/api/index', apiIndexRoute);
app.use('/api/books', apiBooksRoute);
app.use('/api/transactions', apiTransactionsRoute);
app.use('/api/auth', apiAuthRoute);

// app.get("/", (request, response) => {
//   response.render("");
// });

// listen for requests :)

// const listener = app.listen(process.env.PORT, () => {
//   console.log("Your app is listening on port " + listener.address().port);
// });

app.listen(port, () => console.log(`Your app listening at http://localhost:${port}`));