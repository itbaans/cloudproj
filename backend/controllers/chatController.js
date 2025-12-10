const { GoogleGenerativeAI } = require("@google/generative-ai");
const chatModel = require("../models/chatModel");
const logger = require("../utils/logger");

// Initialize Gemini API
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

/**
 * Send a message to the chat assistant
 */
const sendMessage = async (req, res) => {
    const { conversationId, message } = req.body;
    const userId = req.user.userId;

    if (!message || message.trim().length === 0) {
        return res.status(400).json({ error: "Message cannot be empty" });
    }

    try {
        let currentConversationId = conversationId;

        // If no conversation ID provided, create a new conversation
        if (!currentConversationId) {
            const newConversation = await chatModel.createConversation(userId);
            currentConversationId = newConversation.id;
            logger.info({ userId, conversationId: currentConversationId }, "Created new conversation");
        } else {
            // Verify the conversation belongs to the user
            const conversation = await chatModel.getConversationHistory(currentConversationId, userId);
            if (!conversation) {
                return res.status(404).json({ error: "Conversation not found" });
            }
        }

        // Save user message to database
        await chatModel.saveMessage(currentConversationId, "user", message);

        // Get conversation history for context
        const conversationData = await chatModel.getConversationHistory(currentConversationId, userId);

        // Get user's notes for additional context
        const userNotes = await chatModel.getUserNotesForContext(userId, 10);

        // Build context for Gemini
        let contextPrompt = "You are a helpful AI assistant integrated into a note-taking application. ";
        contextPrompt += "You have access to the user's recent notes to help answer questions about them.\n\n";

        if (userNotes.length > 0) {
            contextPrompt += "User's Recent Notes:\n";
            userNotes.forEach((note, index) => {
                contextPrompt += `\nNote ${index + 1}: "${note.note_name}"\n`;
                // Strip HTML tags for cleaner context
                const cleanContent = note.content_html
                    ? note.content_html.replace(/<[^>]*>/g, ' ').substring(0, 500)
                    : "Empty note";
                contextPrompt += `Content: ${cleanContent}...\n`;
            });
            contextPrompt += "\n";
        } else {
            contextPrompt += "The user hasn't created any notes yet.\n\n";
        }

        // Build conversation history
        const chatHistory = conversationData.messages.map(msg => ({
            role: msg.role === "user" ? "user" : "model",
            parts: [{ text: msg.content }]
        }));

        // Initialize Gemini model
        const model = genAI.getGenerativeModel({
            model: process.env.GEMINI_MODEL || "gemini-1.5-flash"
        });

        // Start chat with history
        const chat = model.startChat({
            history: [
                {
                    role: "user",
                    parts: [{ text: contextPrompt }]
                },
                {
                    role: "model",
                    parts: [{ text: "I understand. I'm ready to help you with questions about your notes and provide general assistance." }]
                },
                ...chatHistory.slice(0, -1) // Exclude the last message as we'll send it separately
            ],
            generationConfig: {
                maxOutputTokens: 1000,
                temperature: 0.7,
            },
        });

        // Send the current message and get response
        const result = await chat.sendMessage(message);
        const response = result.response;
        const assistantMessage = response.text();

        // Save assistant response to database
        await chatModel.saveMessage(currentConversationId, "assistant", assistantMessage);

        logger.info({
            userId,
            conversationId: currentConversationId,
            messageLength: message.length,
            responseLength: assistantMessage.length
        }, "Chat message processed successfully");

        res.status(200).json({
            conversationId: currentConversationId,
            message: assistantMessage,
            timestamp: new Date().toISOString(),
        });

    } catch (err) {
        logger.error({ err, userId, conversationId }, "Error processing chat message");

        // Handle specific Gemini API errors
        if (err.message && err.message.includes("API key")) {
            return res.status(500).json({ error: "Chat service configuration error" });
        }

        res.status(500).json({ error: "Failed to process message. Please try again." });
    }
};

/**
 * Get conversation history
 */
const getHistory = async (req, res) => {
    const { conversationId } = req.params;
    const userId = req.user.userId;

    try {
        const conversationData = await chatModel.getConversationHistory(conversationId, userId);

        if (!conversationData) {
            return res.status(404).json({ error: "Conversation not found" });
        }

        logger.info({ userId, conversationId }, "Retrieved conversation history");
        res.status(200).json(conversationData);

    } catch (err) {
        logger.error({ err, userId, conversationId }, "Error retrieving conversation history");
        res.status(500).json({ error: "Internal server error" });
    }
};

/**
 * Get all conversations for the user
 */
const getAllConversations = async (req, res) => {
    const userId = req.user.userId;
    const { limit = 20, offset = 0 } = req.query;

    try {
        const conversations = await chatModel.getAllConversations(
            userId,
            parseInt(limit),
            parseInt(offset)
        );

        logger.info({ userId, count: conversations.length }, "Retrieved all conversations");
        res.status(200).json({ conversations });

    } catch (err) {
        logger.error({ err, userId }, "Error retrieving conversations");
        res.status(500).json({ error: "Internal server error" });
    }
};

/**
 * Delete a conversation
 */
const deleteConversation = async (req, res) => {
    const { conversationId } = req.params;
    const userId = req.user.userId;

    try {
        const deleted = await chatModel.deleteConversation(conversationId, userId);

        if (!deleted) {
            return res.status(404).json({ error: "Conversation not found" });
        }

        logger.info({ userId, conversationId }, "Deleted conversation");
        res.status(200).json({ message: "Conversation deleted successfully" });

    } catch (err) {
        logger.error({ err, userId, conversationId }, "Error deleting conversation");
        res.status(500).json({ error: "Internal server error" });
    }
};

/**
 * Update conversation title
 */
const updateTitle = async (req, res) => {
    const { conversationId } = req.params;
    const { title } = req.body;
    const userId = req.user.userId;

    if (!title || title.trim().length === 0) {
        return res.status(400).json({ error: "Title cannot be empty" });
    }

    try {
        const updated = await chatModel.updateConversationTitle(conversationId, userId, title);

        if (!updated) {
            return res.status(404).json({ error: "Conversation not found" });
        }

        logger.info({ userId, conversationId, title }, "Updated conversation title");
        res.status(200).json({ message: "Title updated successfully" });

    } catch (err) {
        logger.error({ err, userId, conversationId }, "Error updating conversation title");
        res.status(500).json({ error: "Internal server error" });
    }
};

module.exports = {
    sendMessage,
    getHistory,
    getAllConversations,
    deleteConversation,
    updateTitle,
};
