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
const CreateNote = async (userId) => {
  await poolConnect;
  const result = await pool.request()
    .input("userId", sql.Int, userId)
    .query(`
      INSERT INTO notes (user_id)
      OUTPUT inserted.id, inserted.note_name, inserted.updated_at, inserted.created_at
      VALUES (@userId)
    `);
  return result.recordset[0];
};

// Load HTML content of a note
const LoadHTMLByNoteID = async (noteId, userId) => {
  await poolConnect;
  const result = await pool.request()
    .input("noteId", sql.Int, noteId)
    .input("userId", sql.Int, userId)
    .query("SELECT content_html FROM notes WHERE id = @noteId AND user_id = @userId");
  return result.recordset[0];
};

// Save HTML content in a note
const SaveHTMLInNoteID = async (htmlContent, noteId, userId) => {
  await poolConnect;
  const result = await pool.request()
    .input("htmlContent", sql.NVarChar(sql.MAX), htmlContent)
    .input("noteId", sql.Int, noteId)
    .input("userId", sql.Int, userId)
    .query(`
      UPDATE notes
      SET content_html = @htmlContent, updated_at = SYSDATETIME()
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
    SELECT id, note_name, content_html, updated_at, created_at
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
  countFilteredNotes
};