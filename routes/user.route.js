var express = require('express');
var router = express.Router();

const controller = require('../controllers/user.controller');

const validate = require('../validate/user.validate');

const cookieMiddleware = require('..//middlewares/cookie.middleware');

router.get("/", controller.index);
router.post("/create", validate.create, controller.create);
router.get("/:id/remove", controller.remove);
router.get("/:id/edit", controller.edit);
router.post("/:id/update", controller.update);

module.exports = router