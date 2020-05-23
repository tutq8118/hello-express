var express = require('express');
var router = express.Router();

const controller = require('../controllers/auth.controller');
const authMiddleware = require('../middlewares/auth.middleware');


router.get("/login", controller.login);
router.post("/login", controller.postLogin);

module.exports = router