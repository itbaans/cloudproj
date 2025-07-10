import { useState, useEffect } from "react";
import { Button } from "react-bootstrap";
import { FaRegStickyNote } from "react-icons/fa";

import { API_BASE_URL } from "../App/config";
import { useAuth } from "../Authentication/AuthContext";
import { useNote } from "./NoteContext";

// Format date as "Jun 20"
const formatDate = (date) => {
  const parsedDate = new Date(date);
  return parsedDate.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
};

function NotePanel() {
  const [notes, setNotes] = useState([]);
  // const [selectedNoteId, setSelectedNoteId] = useState(null);
 const { selectedNoteId, setSelectedNoteId } = useNote();
  const [hasSelectedInitialNote, setHasSelectedInitialNote] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

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
          setHasSelectedInitialNote(true);
        }
      } catch (err) {
        console.error("Error loading notes:", err);
      }
    };

    fetchNotes();
  }, [token]);

  const handleNewNote = async () => {
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
        title: newNote.title,
        updatedAt: newNote.updated_at,
      };
      console.log(normalized);

      setNotes((prev) => [normalized, ...prev]);
      setSelectedNoteId(normalized.id);
    } catch (err) {
      console.error("Error creating new note:", err);
      alert("Failed to create new note");
    }
  };

  return (
    <div>
      <div
        className="d-flex flex-column bg-light vh-100 border-end"
        style={{ width: "18rem" }}
      >
        {/* Header */}
        <div className="px-2 mb-2 fw-bold" style={{ fontSize: "1rem" }}>
          Notes
        </div>
        {/* Search feature */}
        <div className="px-3 mb-2">
          <input
            type="text"
            className="form-control form-control-sm"
            placeholder="Search notes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ fontSize: "0.75rem" }}
          />
        </div>

        {/* New+ Button */}
        <div className="px-3 mb-2">
          <Button
            variant="success"
            size="sm"
            className="w-50 d-flex justify-content-center align-items-center gap-2"
            onClick={handleNewNote}
            style={{ height: "3rem" }}
          >
            <FaRegStickyNote />
            <span>New+</span>
          </Button>
        </div>

        {/* Scrollable note list */}
        <div
          className="flex-grow-1 overflow-auto"
          style={{ fontSize: "0.6rem" }}
        >
          {notes
            .filter((note) =>
              note.title.toLowerCase().includes(searchQuery.toLowerCase()),
            )
            .map((note) => (
              <div
                key={note.id}
                className={`px-3 py-3 border ${
                  selectedNoteId === note.id
                    ? "bg-primary text-white"
                    : "bg-white"
                }`}
                style={{ cursor: "pointer", whiteSpace: "normal" }}
                title={note.title}
                onClick={() => setSelectedNoteId(note.id)}
              >
                <div
                  className="fw-semibold text-truncate"
                  style={{ fontSize: "0.75rem", lineHeight: "1rem" }}
                >
                  {note.title}
                </div>
                <div
                  className="text-muted"
                  style={{ fontSize: "0.7rem", lineHeight: "0.9rem" }}
                >
                  {formatDate(note.updatedAt)}
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}

export default NotePanel;
