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

const authMiddleware = require('./middlewares/auth.middleware');
const cookieMiddleware = require('./middlewares/cookie.middleware');
const sesstionMiddleware = require('./middlewares/sesstion.middleware');

app.set("view engine", "pug");
app.set("views", "./views");

app.use(cookieParser(process.env.SESSION_SECRET));
app.use(express.static('public'));

app.use(cookieMiddleware.check);
app.use(sesstionMiddleware.check);

app.use('/users', authMiddleware.requireAuth, usersRoute);
app.use('/books', booksRoute);
app.use('/transactions', authMiddleware.requireAuth, transactionsRoute);
app.use('/auth', authRoute);
app.use('/profile', profileRoute);
app.use('/cart', cartRoute);

app.get("/", (request, response) => {
  response.render("");
});

// listen for requests :)

// const listener = app.listen(process.env.PORT, () => {
//   console.log("Your app is listening on port " + listener.address().port);
// });

app.listen(port, () => console.log(`Your app listening at http://localhost:${port}`));