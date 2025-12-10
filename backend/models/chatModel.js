const { sql, pool, poolConnect } = require("../db2");
const logger = require("../utils/logger");

/**
 * Create a new chat conversation for a user
 */
async function createConversation(userId, title = "New Conversation") {
  try {
    await poolConnect;
    const result = await pool
      .request()
      .input("userId", sql.Int, userId)
      .input("title", sql.NVarChar(255), title)
      .query(`
        INSERT INTO chat_conversations (user_id, title, created_at, updated_at)
        OUTPUT INSERTED.*
        VALUES (@userId, @title, SYSDATETIME(), SYSDATETIME())
      `);

    return result.recordset[0];
  } catch (err) {
    logger.error({ err, userId }, "Error creating conversation");
    throw err;
  }
}

/**
 * Save a message to a conversation
 */
async function saveMessage(conversationId, role, content) {
  try {
    await poolConnect;
    const result = await pool
      .request()
      .input("conversationId", sql.Int, conversationId)
      .input("role", sql.NVarChar(20), role)
      .input("content", sql.NVarChar(sql.MAX), content)
      .query(`
        INSERT INTO chat_messages (conversation_id, role, content, created_at)
        OUTPUT INSERTED.*
        VALUES (@conversationId, @role, @content, SYSDATETIME())
      `);

    // Update conversation's updated_at timestamp
    await pool
      .request()
      .input("conversationId", sql.Int, conversationId)
      .query(`
        UPDATE chat_conversations 
        SET updated_at = SYSDATETIME() 
        WHERE id = @conversationId
      `);

    return result.recordset[0];
  } catch (err) {
    logger.error({ err, conversationId, role }, "Error saving message");
    throw err;
  }
}

/**
 * Get conversation history with messages
 */
async function getConversationHistory(conversationId, userId) {
  try {
    await poolConnect;
    
    // First verify the conversation belongs to the user
    const convResult = await pool
      .request()
      .input("conversationId", sql.Int, conversationId)
      .input("userId", sql.Int, userId)
      .query(`
        SELECT * FROM chat_conversations 
        WHERE id = @conversationId AND user_id = @userId
      `);

    if (convResult.recordset.length === 0) {
      return null;
    }

    // Get all messages for this conversation
    const messagesResult = await pool
      .request()
      .input("conversationId", sql.Int, conversationId)
      .query(`
        SELECT id, role, content, created_at
        FROM chat_messages
        WHERE conversation_id = @conversationId
        ORDER BY created_at ASC
      `);

    return {
      conversation: convResult.recordset[0],
      messages: messagesResult.recordset,
    };
  } catch (err) {
    logger.error({ err, conversationId, userId }, "Error getting conversation history");
    throw err;
  }
}

/**
 * Get all conversations for a user
 */
async function getAllConversations(userId, limit = 20, offset = 0) {
  try {
    await poolConnect;
    const result = await pool
      .request()
      .input("userId", sql.Int, userId)
      .input("limit", sql.Int, limit)
      .input("offset", sql.Int, offset)
      .query(`
        SELECT id, title, created_at, updated_at
        FROM chat_conversations
        WHERE user_id = @userId
        ORDER BY updated_at DESC
        OFFSET @offset ROWS
        FETCH NEXT @limit ROWS ONLY
      `);

    return result.recordset;
  } catch (err) {
    logger.error({ err, userId }, "Error getting all conversations");
    throw err;
  }
}

/**
 * Delete a conversation and all its messages
 */
async function deleteConversation(conversationId, userId) {
  try {
    await poolConnect;
    const result = await pool
      .request()
      .input("conversationId", sql.Int, conversationId)
      .input("userId", sql.Int, userId)
      .query(`
        DELETE FROM chat_conversations
        WHERE id = @conversationId AND user_id = @userId
      `);

    return result.rowsAffected[0] > 0;
  } catch (err) {
    logger.error({ err, conversationId, userId }, "Error deleting conversation");
    throw err;
  }
}

/**
 * Get user's notes content for context (to provide to Gemini)
 */
async function getUserNotesForContext(userId, limit = 10) {
  try {
    await poolConnect;
    const result = await pool
      .request()
      .input("userId", sql.Int, userId)
      .input("limit", sql.Int, limit)
      .query(`
        SELECT TOP (@limit) id, note_name, content_html, updated_at
        FROM notes
        WHERE user_id = @userId
        ORDER BY updated_at DESC
      `);

    return result.recordset;
  } catch (err) {
    logger.error({ err, userId }, "Error getting user notes for context");
    throw err;
  }
}

/**
 * Update conversation title
 */
async function updateConversationTitle(conversationId, userId, title) {
  try {
    await poolConnect;
    const result = await pool
      .request()
      .input("conversationId", sql.Int, conversationId)
      .input("userId", sql.Int, userId)
      .input("title", sql.NVarChar(255), title)
      .query(`
        UPDATE chat_conversations
        SET title = @title, updated_at = SYSDATETIME()
        WHERE id = @conversationId AND user_id = @userId
      `);

    return result.rowsAffected[0] > 0;
  } catch (err) {
    logger.error({ err, conversationId, userId }, "Error updating conversation title");
    throw err;
  }
}

module.exports = {
  createConversation,
  saveMessage,
  getConversationHistory,
  getAllConversations,
  deleteConversation,
  getUserNotesForContext,
  updateConversationTitle,
};
