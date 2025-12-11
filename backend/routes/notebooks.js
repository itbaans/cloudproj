const express = require("express");
const router = express.Router();
const notebooksController = require("../controllers/notebooksController");
const verifyToken = require("../middlewares/verifyToken");

// All routes require authentication
router.get("/", verifyToken, notebooksController.getAllNotebooks);
router.post("/", verifyToken, notebooksController.createNotebook);
router.put("/:id", verifyToken, notebooksController.updateNotebookName);
router.delete("/:id", verifyToken, notebooksController.deleteNotebook);
router.get("/:id/notes", verifyToken, notebooksController.getNotebookWithNotes);

module.exports = router;
