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

    // Invalidate cached graph metadata since notes changed
    const userModel = require("../models/userModel");
    await userModel.clearGraphMetadata(userId);

    logger.info({ noteId, userId }, "Note deleted and graph cache cleared");
    res.status(200).json({
      message: "Note delete successfully",
      note: deleteNote,
    });
  } catch (err) {
    logger.error({ err, noteId, userId }, "Error deleting note");
    res.status(500).json({ error: "Internal server error." });
  }
};

/**
 * Toggle note protection (encrypt/decrypt)
 */
const toggleNoteProtection = async (req, res) => {
  const { noteId } = req.params;
  const { isProtected } = req.body;
  const userId = req.user.userId;

  if (typeof isProtected !== 'boolean') {
    return res.status(400).json({ error: "isProtected must be a boolean" });
  }

  try {
    const updatedNote = await notesModel.toggleNoteProtection(noteId, userId, isProtected);

    if (!updatedNote) {
      logger.warn({ noteId, userId }, "Note not found when toggling protection");
      return res.status(404).json({ error: "Note not found" });
    }

    // Clear graph cache so it regenerates with updated protection status
    // (Just invalidate cache, don't regenerate immediately - saves API calls)
    const userModel = require("../models/userModel");
    await userModel.clearGraphMetadata(userId);

    logger.info({ noteId, userId, isProtected }, "Note protection toggled, graph cache cleared");
    res.status(200).json({
      message: `Note ${isProtected ? 'protected' : 'unprotected'} successfully`,
      note: {
        id: updatedNote.id,
        note_name: updatedNote.note_name,
        is_protected: updatedNote.is_protected
      }
    });
  } catch (err) {
    logger.error({ err, noteId, userId }, "Error toggling note protection");
    res.status(500).json({ error: err.message || "Internal server error." });
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

/**
 * Get notes graph data for visualization
 * Uses Gemini API to analyze semantic relationships between notes
 * Checks cached data first to avoid unnecessary API calls
 */
const getNotesGraphData = async (req, res) => {
  const userId = req.user.userId;
  const { forceRegenerate } = req.query; // Allow forcing regeneration

  try {
    // Check if we should use cached data
    if (!forceRegenerate) {
      const userModel = require("../models/userModel");
      const cachedGraph = await userModel.getGraphMetadata(userId);

      if (cachedGraph) {
        logger.info({ userId }, "Returning cached graph data");
        return res.status(200).json(cachedGraph);
      }
    }

    // Fetch all notes with content
    const notes = await notesModel.findAllNotesWithContentByUserID(userId);

    if (notes.length === 0) {
      return res.status(200).json({ nodes: [], links: [] });
    }

    // Separate protected and unprotected notes
    const unprotectedNotes = notes.filter(n => (n.is_protected == 0 || n.is_protected == null));
    const protectedNotes = notes.filter(n => n.is_protected == 1);

    // If no unprotected notes, just return protected ones as isolated nodes
    if (unprotectedNotes.length === 0) {
      const protectedNodes = protectedNotes.map(note => ({
        id: note.id,
        label: note.note_name,
        topic: "Protected",
        isProtected: true,
        preview: "🔒 Protected note"
      }));

      return res.status(200).json({ nodes: protectedNodes, links: [] });
    }

    // Initialize Gemini AI (only for unprotected notes)
    const { GoogleGenerativeAI } = require("@google/generative-ai");
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({
      model: process.env.GEMINI_MODEL || "gemini-1.5-flash"
    });

    // Prepare notes for analysis (limit content to avoid token limits)
    const notesForAnalysis = unprotectedNotes.map(note => ({
      id: note.id,
      name: note.note_name,
      content: note.content_html
        ? note.content_html.replace(/<[^>]*>/g, ' ').substring(0, 500)
        : "Empty note"
    }));

    // Build prompt for Gemini to analyze relationships
    const prompt = `Analyze these notes and identify their topics and relationships.

Notes:
${notesForAnalysis.map((note, idx) => `${idx + 1}. "${note.name}": ${note.content}`).join('\n\n')}

For each note, identify:
1. Primary topic/category (e.g., "Shopping", "Work", "Personal", "Finance", etc.)
2. Similarity scores with other notes (0.0 to 1.0, where 1.0 is very similar)

Return ONLY a valid JSON object in this exact format (no markdown, no extra text):
{
  "topics": [
    {"noteId": 1, "topic": "Shopping", "subtopic": "Groceries"},
    {"noteId": 2, "topic": "Shopping", "subtopic": "Hardware"}
  ],
  "relationships": [
    {"source": 1, "target": 2, "similarity": 0.75}
  ]
}

Rules:
- Only include relationships with similarity >= 0.3
- noteId should be 1-indexed (matching the list above)
- Be concise with topics (max 2 words)`;

    // Get Gemini analysis
    const result = await model.generateContent(prompt);
    const response = result.response;
    let analysisText = response.text();

    // Clean up response - remove markdown code blocks if present
    analysisText = analysisText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();

    let analysis;
    try {
      analysis = JSON.parse(analysisText);
    } catch (parseErr) {
      logger.error({ parseErr, analysisText }, "Failed to parse Gemini response");
      // Fallback to simple graph if parsing fails
      const nodes = notes.map(note => ({
        id: note.id,
        label: note.note_name,
        topic: "Uncategorized"
      }));
      return res.status(200).json({ nodes, links: [] });
    }

    // Build graph structure from UNPROTECTED notes only
    const nodes = unprotectedNotes.map((note, idx) => {
      const topicInfo = analysis.topics?.find(t => t.noteId === idx + 1) || {};
      return {
        id: note.id,
        label: note.note_name,
        topic: topicInfo.topic || "Other",
        subtopic: topicInfo.subtopic || "",
        preview: notesForAnalysis[idx].content.substring(0, 100) + "...",
        isProtected: false
      };
    });

    // Map relationships to actual note IDs
    const links = (analysis.relationships || []).map(rel => {
      const sourceNote = notes[rel.source - 1];
      const targetNote = notes[rel.target - 1];

      if (!sourceNote || !targetNote) return null;

      return {
        source: sourceNote.id,
        target: targetNote.id,
        strength: rel.similarity
      };
    }).filter(link => link !== null);

    // Add protected notes as isolated nodes
    const protectedNodes = protectedNotes.map(note => ({
      id: note.id,
      label: note.note_name,
      topic: "Protected",
      subtopic: "",
      preview: "🔒 Protected note - excluded from AI analysis",
      isProtected: true
    }));

    // Combine all nodes
    const allNodes = [...nodes, ...protectedNodes];

    logger.info({
      userId,
      totalNotes: notes.length,
      unprotectedCount: unprotectedNotes.length,
      protectedCount: protectedNotes.length,
      linksCount: links.length
    }, "Generated notes graph data");

    const graphData = { nodes: allNodes, links };

    // Save graph metadata to database for future use
    const userModel = require("../models/userModel");
    await userModel.saveGraphMetadata(userId, graphData);
    logger.info({ userId }, "Saved graph metadata to database");

    res.status(200).json(graphData);

  } catch (err) {
    logger.error({ err, userId }, "Error generating notes graph");
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
  getNotesGraphData,
  toggleNoteProtection,
};
