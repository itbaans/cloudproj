import { useState, useEffect } from "react";
import { FaRegStickyNote, FaSearch } from "react-icons/fa";
import "./NotePanel.css"; // Import the CSS file

import { API_BASE_URL } from "../App/config";
import { useAuth } from "../Authentication/AuthContext";
import { useNote } from "./NoteContext";

// Format date as "x minutes/hours/days ago"
const formatDate = (date) => {
  const parsedDate = new Date(date);
  const now = new Date();
  const diff = Math.floor((now - parsedDate) / 1000); // diff in seconds

  if (diff < 5) return "just now";
  if (diff < 60) return `${diff} second${diff !== 1 ? "s" : ""} ago`;
  if (diff < 3600)
    return `${Math.floor(diff / 60)} minute${Math.floor(diff / 60) !== 1 ? "s" : ""} ago`;
  if (diff < 86400)
    return `${Math.floor(diff / 3600)} hour${Math.floor(diff / 3600) !== 1 ? "s" : ""} ago`;
  if (diff < 2592000)
    return `${Math.floor(diff / 86400)} day${Math.floor(diff / 86400) !== 1 ? "s" : ""} ago`;
  if (diff < 31536000)
    return `${Math.floor(diff / 2592000)} month${Math.floor(diff / 2592000) !== 1 ? "s" : ""} ago`;
  return `${Math.floor(diff / 31536000)} year${Math.floor(diff / 31536000) !== 1 ? "s" : ""} ago`;
};

function NotePanel() {
  const [notes, setNotes] = useState([]);
  const { selectedNoteId, setSelectedNoteId } = useNote();
  const { selectedNoteName, setSelectedNoteName } = useNote();
  const [hasSelectedInitialNote, setHasSelectedInitialNote] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isCreatingNote, setIsCreatingNote] = useState(false);

  const { token } = useAuth();
  console.log(selectedNoteId);

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/note/all`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) throw new Error("Failed to fetch notes");
        const data = await response.json();
        setNotes(data);
        if (!hasSelectedInitialNote && data.length > 0) {
          setSelectedNoteId(data[0].id);
          setSelectedNoteName(data[0].note_name);
          setHasSelectedInitialNote(true);
        }
      } catch (err) {
        console.error("Error loading notes:", err);
      }
    };

    fetchNotes();
  }, [token, hasSelectedInitialNote, setSelectedNoteId, selectedNoteName]);

  const handleNewNote = async () => {
    if (isCreatingNote) return;
    
    setIsCreatingNote(true);
    try {
      const response = await fetch(`${API_BASE_URL}/note/create`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) throw new Error("Failed to create new note");

      const newNote = await response.json();
      const normalized = {
        id: newNote.id,
        note_name: newNote.note_name,
        updatedAt: newNote.updated_at,
      };

      setNotes((prev) => [normalized, ...prev]);
      setSelectedNoteId(normalized.id);
    } catch (err) {
      console.error("Error creating new note:", err);
      alert("Failed to create new note");
    } finally {
      setIsCreatingNote(false);
    }
  };

  const handleNoteContext = async (note) => {
    setSelectedNoteId(note.id);
    setSelectedNoteName(note.note_name);
  };

  const filteredNotes = notes.filter((note) =>
    note.note_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="note-panel">
      {/* Header */}
      <div className="note-panel-header">
        <h2 className="note-panel-note_name">Notes</h2>
      </div>

      <div className="note-panel-content">
        {/* Search feature */}
        <div className="search-container">
          <input
            type="text"
            className="search-input"
            placeholder="Search notes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* New Note Button */}
        <div className="new-note-container">
          <button
            className="new-note-button"
            onClick={handleNewNote}
            disabled={isCreatingNote}
          >
            <FaRegStickyNote className="new-note-icon" />
            <span>{isCreatingNote ? "Creating..." : "New Note"}</span>
          </button>
        </div>

        {/* Notes List */}
        <div className="notes-list-container">
          {filteredNotes.length === 0 ? (
            <div className="empty-state">
              <FaRegStickyNote className="empty-state-icon" />
              <div className="empty-state-text">
                {searchQuery ? "No notes found" : "No notes yet"}
              </div>
              <div className="empty-state-subtext">
                {searchQuery 
                  ? "Try adjusting your search terms" 
                  : "Create your first note to get started"
                }
              </div>
            </div>
          ) : (
            filteredNotes.map((note) => (
              <div
                key={note.id}
                className={`note-item ${selectedNoteId === note.id ? "active" : ""}`}
                onClick={() => handleNoteContext(note)}
                note_name={note.note_name}
              >
                <div className="note-note_name">{note.note_name}</div>
                <div className="note-date">{formatDate(note.updatedAt)}</div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default NotePanel;