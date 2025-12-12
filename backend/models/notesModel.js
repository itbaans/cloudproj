const { sql, pool, poolConnect } = require("../db2");

// Get all details of a specific note
const findNoteByUserID = async (userId, noteId) => {
  await poolConnect;
  const result = await pool.request()
    .input("userId", sql.Int, userId)
    .input("noteId", sql.Int, noteId)
    .query("SELECT * FROM notes WHERE user_id = @userId AND id = @noteId");
  return result.recordset[0];
};

// Get all names and ids of notes, without content
const findAllNotesByUserID = async (userId) => {
  await poolConnect;
  const result = await pool.request()
    .input("userId", sql.Int, userId)
    .query("SELECT id, note_name, updated_at, created_at FROM notes WHERE user_id = @userId");
  return result.recordset;
};

// Find note by note ID
const findNoteByNoteID = async (noteId) => {
  await poolConnect;
  const result = await pool.request()
    .input("noteId", sql.Int, noteId)
    .query("SELECT * FROM notes WHERE id = @noteId");
  return result.recordset[0];
};

// Create a new note
const CreateNote = async (userId, notebookId = null) => {
  await poolConnect;
  const result = await pool.request()
    .input("userId", sql.Int, userId)
    .input("notebookId", sql.Int, notebookId)
    .query(`
      INSERT INTO notes (user_id, notebook_id)
      OUTPUT inserted.id, inserted.note_name, inserted.updated_at, inserted.created_at, inserted.notebook_id
      VALUES (@userId, @notebookId)
    `);
  return result.recordset[0];
};

// Load HTML content of a note
const LoadHTMLByNoteID = async (noteId, userId) => {
  await poolConnect;
  const result = await pool.request()
    .input("noteId", sql.Int, noteId)
    .input("userId", sql.Int, userId)
    .query("SELECT content_html, is_protected, encryption_iv, notebook_id FROM notes WHERE id = @noteId AND user_id = @userId");

  if (result.recordset.length === 0) return null;
  const note = result.recordset[0];

  // Decrypt if protected
  if (note.is_protected && note.content_html) {
    const encryption = require("../utils/encryption");
    try {
      // Extract auth tag from end of encrypted data (last 32 hex chars = 16 bytes)
      const encryptedData = note.content_html.slice(0, -32);
      const authTag = note.content_html.slice(-32);

      const decrypted = encryption.decryptContent(
        encryptedData,
        note.encryption_iv,
        authTag,
        userId
      );
      return { content_html: decrypted, is_protected: true, notebook_id: note.notebook_id };
    } catch (err) {
      throw new Error("Failed to decrypt protected note");
    }
  }

  return { content_html: note.content_html, is_protected: note.is_protected || false, notebook_id: note.notebook_id };
};

// Save HTML content in a note
const SaveHTMLInNoteID = async (htmlContent, noteId, userId) => {
  await poolConnect;

  // Check if note is protected
  const checkResult = await pool.request()
    .input("noteId", sql.Int, noteId)
    .input("userId", sql.Int, userId)
    .query("SELECT is_protected FROM notes WHERE id = @noteId AND user_id = @userId");

  const note = checkResult.recordset[0];

  if (!note) {
    throw new Error("Note not found");
  }

  let contentToSave = htmlContent;
  let ivToSave = null;

  // Encrypt if protected
  if (note.is_protected) {
    const encryption = require("../utils/encryption");
    const { encryptedData, iv, authTag } = encryption.encryptContent(htmlContent, userId);
    // Append auth tag to encrypted data for storage
    contentToSave = encryptedData + authTag;
    ivToSave = iv;
  }

  const result = await pool.request()
    .input("htmlContent", sql.NVarChar(sql.MAX), contentToSave)
    .input("noteId", sql.Int, noteId)
    .input("userId", sql.Int, userId)
    .input("iv", sql.NVarChar(64), ivToSave)
    .query(`
      UPDATE notes
      SET content_html = @htmlContent, 
          encryption_iv = COALESCE(@iv, encryption_iv),
          updated_at = SYSDATETIME()
      OUTPUT inserted.*
      WHERE id = @noteId AND user_id = @userId
   `);
  return result.recordset[0];
};

// Save new name in a note
const SaveNewNameInNoteID = async (noteName, noteId, userId) => {
  await poolConnect;
  const result = await pool.request()
    .input("noteName", sql.NVarChar(255), noteName)
    .input("noteId", sql.Int, noteId)
    .input("userId", sql.Int, userId)
    .query(`
      UPDATE notes
      SET note_name = @noteName, updated_at = SYSDATETIME()
      OUTPUT inserted.*
      WHERE id = @noteId AND user_id = @userId
    `);
  return result.recordset[0];
};

// Delete a note
const DeleteNote = async (noteId, userId) => {
  await poolConnect;
  const result = await pool.request()
    .input("noteId", sql.Int, noteId)
    .input("userId", sql.Int, userId)
    .query(`
      DELETE FROM notes
      OUTPUT deleted.*
      WHERE id = @noteId AND user_id = @userId
    `);
  return result.recordset[0];
};

// Get notes for dashboard with search, sort, pagination
const findAllNotesByUserIDForDashboard = async (
  userId,
  {
    limit = 10,
    offset = 0,
    searchKeyword = "",
    sortBy = "updated_at",
    order = "DESC",
  }
) => {
  await poolConnect;

  const validSortColumns = ["created_at", "updated_at", "note_name"];
  const validOrder = ["ASC", "DESC"];

  if (!validSortColumns.includes(sortBy)) sortBy = "updated_at";
  if (!validOrder.includes(order.toUpperCase())) order = "DESC";

  const query = `
    SELECT id, note_name, content_html, updated_at, created_at, is_protected
    FROM notes
    WHERE user_id = @userId
      AND (note_name LIKE @search COLLATE SQL_Latin1_General_CP1_CI_AS
           OR content_html LIKE @search COLLATE SQL_Latin1_General_CP1_CI_AS)
    ORDER BY ${sortBy} ${order}
    OFFSET @offset ROWS FETCH NEXT @limit ROWS ONLY
  `;

  const result = await pool.request()
    .input("userId", sql.Int, userId)
    .input("search", sql.NVarChar(255), `%${searchKeyword}%`)
    .input("limit", sql.Int, limit)
    .input("offset", sql.Int, offset)
    .query(query);

  return result.recordset;
};

// Count filtered notes
const countFilteredNotes = async (userId, searchKeyword = "") => {
  await poolConnect;
  const query = `
    SELECT COUNT(*) AS count
    FROM notes
    WHERE user_id = @userId
      AND (note_name LIKE @search COLLATE SQL_Latin1_General_CP1_CI_AS
           OR content_html LIKE @search COLLATE SQL_Latin1_General_CP1_CI_AS)
  `;
  const result = await pool.request()
    .input("userId", sql.Int, userId)
    .input("search", sql.NVarChar(255), `%${searchKeyword}%`)
    .query(query);
  return parseInt(result.recordset[0].count);
};

// Get all notes WITH content for graph generation
const findAllNotesWithContentByUserID = async (userId) => {
  await poolConnect;
  const result = await pool.request()
    .input("userId", sql.Int, userId)
    .query("SELECT id, note_name, content_html, updated_at, created_at, is_protected FROM notes WHERE user_id = @userId ORDER BY updated_at DESC");
  return result.recordset;
};

/**
 * Toggle note protection status
 * Encrypts content if protecting, decrypts if unprotecting
 */
const toggleNoteProtection = async (noteId, userId, isProtected) => {
  await poolConnect;

  // Get current note
  const noteResult = await pool.request()
    .input("noteId", sql.Int, noteId)
    .input("userId", sql.Int, userId)
    .query("SELECT content_html, is_protected, encryption_iv FROM notes WHERE id = @noteId AND user_id = @userId");

  const note = noteResult.recordset[0];

  if (!note) {
    throw new Error("Note not found");
  }

  let contentToSave = note.content_html;
  let ivToSave = null;

  const encryption = require("../utils/encryption");

  // Protecting: encrypt plaintext
  if (isProtected && !note.is_protected) {
    const { encryptedData, iv, authTag } = encryption.encryptContent(note.content_html || '', userId);
    contentToSave = encryptedData + authTag;
    ivToSave = iv;
  }
  // Unprotecting: decrypt encrypted content
  else if (!isProtected && note.is_protected) {
    if (note.content_html && note.encryption_iv) {
      const encryptedData = note.content_html.slice(0, -32);
      const authTag = note.content_html.slice(-32);
      contentToSave = encryption.decryptContent(encryptedData, note.encryption_iv, authTag, userId);
    } else {
      // Empty or null content, just set to empty string
      contentToSave = '';
    }
    ivToSave = null; // Clear IV when unprotecting
  }

  // Update note
  const result = await pool.request()
    .input("noteId", sql.Int, noteId)
    .input("userId", sql.Int, userId)
    .input("isProtected", sql.Bit, isProtected ? 1 : 0)
    .input("content", sql.NVarChar(sql.MAX), contentToSave)
    .input("iv", sql.NVarChar(64), ivToSave)
    .query(`
      UPDATE notes
      SET is_protected = @isProtected,
          content_html = @content,
          encryption_iv = @iv,
          updated_at = SYSDATETIME()
      OUTPUT inserted.*
      WHERE id = @noteId AND user_id = @userId
    `);

  return result.recordset[0];
};

// Move note to a different notebook
const moveNoteToNotebook = async (noteId, userId, notebookId) => {
  await poolConnect;
  const result = await pool.request()
    .input("noteId", sql.Int, noteId)
    .input("userId", sql.Int, userId)
    .input("notebookId", sql.Int, notebookId)
    .query(`
      UPDATE notes
      SET notebook_id = @notebookId, updated_at = SYSDATETIME()
      OUTPUT inserted.*
      WHERE id = @noteId AND user_id = @userId
    `);
  return result.recordset[0];
};

module.exports = {
  findNoteByUserID,
  findAllNotesByUserID,
  findAllNotesByUserIDForDashboard,
  findNoteByNoteID,
  LoadHTMLByNoteID,
  SaveHTMLInNoteID,
  CreateNote,
  DeleteNote,
  SaveNewNameInNoteID,
  countFilteredNotes,
  findAllNotesWithContentByUserID,
  toggleNoteProtection,
  moveNoteToNotebook,
};
