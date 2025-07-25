const notesModel = require("../models/notesModel");

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
  return res.status(404).json({ error: "Note not found" });
}
    res.status(200).json({
      message: "Note content updated successfully.",
    });
  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({ error: "Internal server error." });
  }
};

const getNoteContent = async (req, res) => {
  const { noteId } = req.params;
  const userId = req.user.userId;

  try {
    const getNote = await notesModel.LoadHTMLByNoteID(noteId, userId);

    if (!getNote) {
      return res.status(404).json({ error: "Note not found" });
    }
    res.status(200).json(getNote);
  } catch (err) {
    console.error("Error", err);
    res.status(500).json({ error: "Internal server error." });
  }
};

const getAllUserNotes = async (req, res) => {
  const userId = req.user.userId;

  try {
    const getNotes = await notesModel.findAllNotesByUserID(userId);

    const formattedNotes = getNotes.map((note) => ({
      id: note.id,
      title: note.note_name, // frontend expects 'title'
      updatedAt: note.updated_at,
      createdAt: note.created_at,
    }));

    res.status(200).json(formattedNotes); //
  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({ error: "Internal server error." });
  }
};

const createNewNote = async (req, res) => {
  const userId = req.user.userId;
  try {
    const createNote = await notesModel.CreateNote(userId);

    const note = {
      id: createNote.id,
      title: createNote.note_name,
      updated_at: createNote.updated_at,
      created_at: createNote.created_at,
    };
    res.status(200).json(note);
  } catch (err) {
    res.status(500).json({ error: "Internal server error." });
  }
};

const deleteNote = async (req, res) => {
  const { noteId } = req.params;
  const userId = req.user.userId;

  try {
    const deleteNote = await notesModel.DeleteNote(noteId, userId);

    res.status(200).json({
      message: "Note delete successfully",
      note: deleteNote,
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
};
