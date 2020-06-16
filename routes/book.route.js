const express = require('express');
const router = express.Router();

const controller = require('../controllers/book.controller');

var multer  = require('multer');
var upload = multer({ dest: 'public/uploads/' });

router.get("/", controller.index);

router.post("/create", controller.create);

router.get("/:id/remove", controller.remove);

router.get("/:id/edit", controller.edit);

router.post("/:id/update", upload.single('cover'), controller.update);

module.exports = router