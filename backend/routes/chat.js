const express = require("express");
const router = express.Router();
const chatController = require("../controllers/chatController");
const verifyToken = require("../middlewares/verifyToken");

// All routes require authentication
router.use(verifyToken);

// Send a message to the chat assistant
router.post("/message", chatController.sendMessage);

// Get conversation history
router.get("/history/:conversationId", chatController.getHistory);

// Reset conversation (clear messages)
router.post("/reset", chatController.resetConversation);

module.exports = router;
