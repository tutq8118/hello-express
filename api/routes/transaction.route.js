const express = require('express');
const router = express.Router();

const controller = require('../controllers/transaction.controller');

router.get("/", controller.index);

router.post("/create", controller.create);

router.get("/:id/remove", controller.remove);

router.get("/:id/edit", controller.edit);

router.post("/:id/update", controller.update);

router.get("/:id/complete", controller.complete);

module.exports = router