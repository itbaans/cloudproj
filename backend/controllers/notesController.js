const notesModel = require("../models/notesModel");
const logger = require("../utils/logger");

const updateNoteContent = async (req, res) => {
  const { noteId } = req.params;
  const { ContentHTML } = req.body;
  const userId = req.user.userId;

  if (!ContentHTML) {
    return res
      .status(400)
      .json({ error: "Missing HTML content in request body." });
  }
  try {
    const updatedNote = await notesModel.SaveHTMLInNoteID(
      ContentHTML,
      noteId,
      userId,
    );

    if (!updatedNote) {
      logger.warn({ noteId, userId }, "Note not found when updating content");
      return res.status(404).json({ error: "Note not found" });
    }

    logger.info({ noteId, userId }, "Note content updated successfully");
    res.status(200).json({
      message: "Note content updated successfully.",
    });
  } catch (err) {
    logger.error({ err, noteId, userId }, "Error updating note content");
    res.status(500).json({ error: "Internal server error." });
  }
};

const updateNoteName = async (req, res) => {
  const { noteId } = req.params;
  const { noteName } = req.body;
  const userId = req.user.userId;

  if (!noteName) {
    return res
      .status(400)
      .json({ error: "Missing HTML content in request body." });
  }
  try {
    const updatedName = await notesModel.SaveNewNameInNoteID(
      noteName,
      noteId,
      userId,
    );

    if (!updatedName) {
      logger.warn({ noteId, userId }, "Note not found when updating name");
      return res.status(404).json({ error: "Note not found" });
    }
    logger.info(
      { noteId, userId, newName: noteName },
      "Note name updated successfully",
    );
    res.status(200).json({
      message: "Note name updated successfully.",
    });
  } catch (err) {
    logger.error({ err, noteId, userId }, "Error updating note name");
    res.status(500).json({ error: "Internal server error." });
  }
};

const getNoteContent = async (req, res) => {
  const { noteId } = req.params;
  const userId = req.user.userId;

  try {
    const getNote = await notesModel.LoadHTMLByNoteID(noteId, userId);

    if (!getNote) {
      logger.warn({ noteId, userId }, "Note not found when fetching content");
      return res.status(404).json({ error: "Note not found" });
    }
    logger.info({ noteId, userId }, "Note content fetched successfully");
    res.status(200).json(getNote);
  } catch (err) {
    logger.error({ err, noteId, userId }, "Error fetching note content");
    res.status(500).json({ error: "Internal server error." });
  }
};

const getAllUserNotes = async (req, res) => {
  const userId = req.user.userId;

  try {
    const getNotes = await notesModel.findAllNotesByUserID(userId);

    const formattedNotes = getNotes.map((note) => ({
      id: note.id,
      note_name: note.note_name,
      updatedAt: note.updated_at,
      createdAt: note.created_at,
    }));

    logger.info(
      { userId, count: formattedNotes.length },
      "Fetched all user notes",
    );
    res.status(200).json(formattedNotes); //
  } catch (err) {
    logger.error({ err, userId }, "Error fetching user notes");
    res.status(500).json({ error: "Internal server error." });
  }
};

const createNewNote = async (req, res) => {
  const userId = req.user.userId;
  try {
    const createNote = await notesModel.CreateNote(userId);

    const note = {
      id: createNote.id,
      note_name: createNote.note_name,
      updated_at: createNote.updated_at,
      created_at: createNote.created_at,
    };
    logger.info({ noteId: note.id, userId }, "Note created");
    res.status(200).json(note);
  } catch (err) {
    logger.error({ err, userId }, "Error creating new note");
    res.status(500).json({ error: "Internal server error." });
  }
};

const deleteNote = async (req, res) => {
  const { noteId } = req.params;
  const userId = req.user.userId;

  try {
    const deleteNote = await notesModel.DeleteNote(noteId, userId);

    logger.info({ noteId, userId }, "Note deleted");
    res.status(200).json({
      message: "Note delete successfully",
      note: deleteNote,
    });
  } catch (err) {
    logger.error({ err, noteId, userId }, "Error deleting note");
    res.status(500).json({ error: "Internal server error." });
  }
};

const getAllUserNotesForDashboard = async (req, res) => {
  const userId = req.user.userId;
  const {
    page = 1,
    limit = 10,
    search = "",
    sortBy = "updated_at",
    order = "DESC",
  } = req.query;

  const offset = (page - 1) * limit;

  try {
    const notes = await notesModel.findAllNotesByUserIDForDashboard(userId, {
      limit: parseInt(limit),
      offset: parseInt(offset),
      searchKeyword: search,
      sortBy,
      order,
    });

    const totalCount = await notesModel.countFilteredNotes(userId, search);

    res.status(200).json({
      notes,
      page: parseInt(page),
      limit: parseInt(limit),
      totalCount,
    });
  } catch (err) {
    res.status(500).json({ error: "Internal server error." });
  }
};


module.exports = {
  updateNoteContent,
  getNoteContent,
  createNewNote,
  deleteNote,
  getAllUserNotes,
  getAllUserNotesForDashboard,
  updateNoteName,
};
