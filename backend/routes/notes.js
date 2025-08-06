const express = require("express");
const router = express.Router();
const notesController = require("../controllers/notesController");
const verifyToken = require('../middlewares/verifyToken');

//save html into Note
router.put("/save/:noteId", verifyToken, notesController.updateNoteContent);
// load html from note
router.get("/load/:noteId",verifyToken, notesController.getNoteContent);
// create new note
router.post("/create", verifyToken, notesController.createNewNote);
// delete note
router.delete("/remove/:noteId", verifyToken, notesController.deleteNote);
// get all notes of user
router.get("/all", verifyToken, notesController.getAllUserNotes);
// get all notes for dashboard
router.get("/dashboard", verifyToken, notesController.getAllUserNotesForDashboard);
// update notename
router.put("/name/:noteId", verifyToken, notesController.updateNoteName);

module.exports = router;
