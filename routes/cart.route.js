var express = require('express');
var router = express.Router();
const authMiddleware = require('../middlewares/auth.middleware');

const controller = require('../controllers/cart.controller');

router.get("/add/:id", controller.add);
router.get("/checkout", authMiddleware.requireAuth, controller.checkout);

module.exports = router