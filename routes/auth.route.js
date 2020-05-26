var express = require('express');
var router = express.Router();
const validate = require('../validate/auth.validate');

const controller = require('../controllers/auth.controller');
const authMiddleware = require('../middlewares/auth.middleware');


router.get("/login", controller.login);
router.get("/logout", controller.logout);
router.post("/create", validate.create, controller.create);
router.post("/login", controller.postLogin);

module.exports = router