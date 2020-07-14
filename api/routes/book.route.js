const express = require('express');
const router = express.Router();

const controller = require('../controllers/book.controller');

var multer  = require('multer');
var upload = multer({ dest: 'public/uploads/' });

router.get("/", controller.index);

module.exports = router