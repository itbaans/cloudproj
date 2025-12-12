const express = require("express");
const router = express.Router();
const tasksController = require("../controllers/tasksController");
const verifyToken = require("../middlewares/verifyToken");

// All routes require authentication
router.get("/", verifyToken, tasksController.getTasks);
router.post("/", verifyToken, tasksController.createTask);
router.patch("/:id", verifyToken, tasksController.toggleTaskStatus);
router.delete("/all", verifyToken, tasksController.deleteAllTasks);
router.delete("/:id", verifyToken, tasksController.deleteTask);

module.exports = router;

