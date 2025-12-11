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
 * Get or create a conversation based on type (global or local)
 * For global: one per user
 * For local: one per user-note pair
 */
async function getOrCreateConversation(userId, type, noteId = null) {
  try {
    await poolConnect;

    // Build the query based on type
    let query, inputs;

    if (type === 'global') {
      // Find global conversation for this user
      const result = await pool
        .request()
        .input("userId", sql.Int, userId)
        .input("type", sql.NVarChar(20), "global")
        .query(`
          SELECT * FROM chat_conversations
          WHERE user_id = @userId AND conversation_type = @type
        `);

      if (result.recordset.length > 0) {
        return result.recordset[0];
      }

      // Create new global conversation
      const createResult = await pool
        .request()
        .input("userId", sql.Int, userId)
        .input("type", sql.NVarChar(20), "global")
        .input("title", sql.NVarChar(255), "Global Chat")
        .query(`
          INSERT INTO chat_conversations (user_id, conversation_type, title, created_at, updated_at)
          OUTPUT INSERTED.*
          VALUES (@userId, @type, @title, SYSDATETIME(), SYSDATETIME())
        `);

      return createResult.recordset[0];

    } else if (type === 'local') {
      // Find local conversation for this user-note pair
      const result = await pool
        .request()
        .input("userId", sql.Int, userId)
        .input("noteId", sql.Int, noteId)
        .input("type", sql.NVarChar(20), "local")
        .query(`
          SELECT * FROM chat_conversations
          WHERE user_id = @userId AND note_id = @noteId AND conversation_type = @type
        `);

      if (result.recordset.length > 0) {
        return result.recordset[0];
      }

      // Create new local conversation for this note
      const createResult = await pool
        .request()
        .input("userId", sql.Int, userId)
        .input("noteId", sql.Int, noteId)
        .input("type", sql.NVarChar(20), "local")
        .input("title", sql.NVarChar(255), "Note Chat")
        .query(`
          INSERT INTO chat_conversations (user_id, note_id, conversation_type, title, created_at, updated_at)
          OUTPUT INSERTED.*
          VALUES (@userId, @noteId, @type, @title, SYSDATETIME(), SYSDATETIME())
        `);

      return createResult.recordset[0];
    }

    throw new Error("Invalid conversation type");
  } catch (err) {
    logger.error({ err, userId, type, noteId }, "Error getting or creating conversation");
    throw err;
  }
}

/**
 * Reset a conversation by deleting all its messages
 */
async function resetConversation(conversationId, userId) {
  try {
    await poolConnect;

    // Verify the conversation belongs to the user
    const convResult = await pool
      .request()
      .input("conversationId", sql.Int, conversationId)
      .input("userId", sql.Int, userId)
      .query(`
        SELECT * FROM chat_conversations
        WHERE id = @conversationId AND user_id = @userId
      `);

    if (convResult.recordset.length === 0) {
      return false;
    }

    // Delete all messages in this conversation
    await pool
      .request()
      .input("conversationId", sql.Int, conversationId)
      .query(`
        DELETE FROM chat_messages
        WHERE conversation_id = @conversationId
      `);

    // Update the conversation's updated_at timestamp
    await pool
      .request()
      .input("conversationId", sql.Int, conversationId)
      .query(`
        UPDATE chat_conversations
        SET updated_at = SYSDATETIME()
        WHERE id = @conversationId
      `);

    return true;
  } catch (err) {
    logger.error({ err, conversationId, userId }, "Error resetting conversation");
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
          AND (is_protected IS NULL OR is_protected = 0)
        ORDER BY updated_at DESC
      `);

    return result.recordset;
  } catch (err) {
    logger.error({ err, userId }, "Error getting user notes for context");
    throw err;
  }
}

/**
 * Get a specific note for local context (single note)
 */
async function getSpecificNoteForContext(noteId, userId) {
  try {
    await poolConnect;
    const result = await pool
      .request()
      .input("noteId", sql.Int, noteId)
      .input("userId", sql.Int, userId)
      .query(`
        SELECT id, note_name, content_html, updated_at, is_protected
        FROM notes
        WHERE id = @noteId AND user_id = @userId
      `);

    const note = result.recordset.length > 0 ? result.recordset[0] : null;

    // Check if note is protected
    if (note && note.is_protected) {
      return {
        error: "Protected notes cannot be used in AI chat",
        isProtected: true
      };
    }

    return note;
  } catch (err) {
    logger.error({ err, noteId, userId }, "Error getting specific note for context");
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
  getSpecificNoteForContext,
  updateConversationTitle,
  getOrCreateConversation,
  resetConversation,
};
