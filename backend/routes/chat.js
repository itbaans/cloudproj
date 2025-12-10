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

// Get all conversations for the user
router.get("/conversations", chatController.getAllConversations);

// Delete a conversation
router.delete("/conversation/:conversationId", chatController.deleteConversation);

// Update conversation title
router.put("/conversation/:conversationId/title", chatController.updateTitle);

module.exports = router;
