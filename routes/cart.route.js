var express = require('express');
var router = express.Router();

const controller = require('../controllers/cart.controller');

router.get("/add/:id", controller.add);
router.get("/checkout", controller.checkout);

module.exports = router