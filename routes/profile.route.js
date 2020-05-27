var express = require('express');
var router = express.Router();

const controller = require('../controllers/profile.controller');

var multer  = require('multer');
var upload = multer({ dest: 'public/uploads/' });

router.get("/", controller.index);
router.post("/update", upload.single('avatar'), controller.update);

module.exports = router