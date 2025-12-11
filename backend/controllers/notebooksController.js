const notebooksModel = require("../models/notebooksModel");
const logger = require("../utils/logger");

// Get all notebooks for the authenticated user
const getAllNotebooks = async (req, res) => {
    try {
        const userId = req.user.userId;
        const notebooks = await notebooksModel.getAllNotebooks(userId);

        logger.info({ userId, count: notebooks.length }, "Fetched all notebooks");
        res.status(200).json({ notebooks });
    } catch (error) {
        logger.error({ error, userId: req.user.userId }, "Error fetching notebooks");
        res.status(500).json({ error: "Failed to fetch notebooks" });
    }
};

// Create a new notebook
const createNotebook = async (req, res) => {
    try {
        const userId = req.user.userId;
        const { notebookName } = req.body;

        const notebook = await notebooksModel.createNotebook(
            userId,
            notebookName || "New Notebook"
        );

        logger.info({ userId, notebookId: notebook.id }, "Created new notebook");
        res.status(201).json({ notebook });
    } catch (error) {
        logger.error({ error, userId: req.user.userId }, "Error creating notebook");
        res.status(500).json({ error: "Failed to create notebook" });
    }
};

// Update notebook name
const updateNotebookName = async (req, res) => {
    try {
        const userId = req.user.userId;
        const { id } = req.params;
        const { notebookName } = req.body;

        if (!notebookName || notebookName.trim() === "") {
            return res.status(400).json({ error: "Notebook name is required" });
        }

        const notebook = await notebooksModel.updateNotebookName(
            id,
            userId,
            notebookName.trim()
        );

        if (!notebook) {
            return res.status(404).json({ error: "Notebook not found" });
        }

        logger.info({ userId, notebookId: id }, "Updated notebook name");
        res.status(200).json({ notebook });
    } catch (error) {
        logger.error({ error, userId: req.user.userId }, "Error updating notebook");
        res.status(500).json({ error: "Failed to update notebook" });
    }
};

// Delete a notebook
const deleteNotebook = async (req, res) => {
    try {
        const userId = req.user.userId;
        const { id } = req.params;

        // Check if it's the Uncategorized notebook
        const notebooks = await notebooksModel.getAllNotebooks(userId);
        const notebookToDelete = notebooks.find(n => n.id === parseInt(id));

        if (notebookToDelete && notebookToDelete.notebook_name === 'Uncategorized') {
            return res.status(400).json({ error: "Cannot delete the Uncategorized notebook" });
        }

        const deletedNotebook = await notebooksModel.deleteNotebook(id, userId);

        if (!deletedNotebook) {
            return res.status(404).json({ error: "Notebook not found" });
        }

        logger.info({ userId, notebookId: id }, "Deleted notebook, notes moved to Uncategorized");
        res.status(200).json({
            message: "Notebook deleted successfully. Notes moved to Uncategorized."
        });
    } catch (error) {
        logger.error({ error, userId: req.user.userId }, "Error deleting notebook");
        res.status(500).json({ error: "Failed to delete notebook" });
    }
};

// Get notebook with all its notes
const getNotebookWithNotes = async (req, res) => {
    try {
        const userId = req.user.userId;
        const { id } = req.params;

        const notebook = await notebooksModel.getNotebookWithNotes(id, userId);

        if (!notebook) {
            return res.status(404).json({ error: "Notebook not found" });
        }

        logger.info({ userId, notebookId: id, noteCount: notebook.notes.length }, "Fetched notebook with notes");
        res.status(200).json({ notebook });
    } catch (error) {
        logger.error({ error, userId: req.user.userId }, "Error fetching notebook");
        res.status(500).json({ error: "Failed to fetch notebook" });
    }
};

module.exports = {
    getAllNotebooks,
    createNotebook,
    updateNotebookName,
    deleteNotebook,
    getNotebookWithNotes,
};
