var express = require('express');
var router = express.Router();

const controller = require('../controllers/user.controller');

const validate = require('../validate/user.validate');

const cookieMiddleware = require('..//middlewares/cookie.middleware');

router.get("/", controller.index);

module.exports = router