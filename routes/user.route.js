var express = require('express');
var router = express.Router();

const controller = require('../controllers/user.controller');

router.get("/", controller.index);
router.get("/:id/remove", controller.remove);
router.get("/:id/edit", controller.edit);
router.post("/:id/update", controller.update);

module.exports = router