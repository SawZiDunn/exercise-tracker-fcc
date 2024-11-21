const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

router.get("", userController.index).post("", userController.createUser);
router.post("/:_id/exercises", userController.addExercise);
router.get("/:_id/logs", userController.getLogs);

module.exports = router;
