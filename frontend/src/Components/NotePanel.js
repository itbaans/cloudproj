import { useState, useEffect } from "react";
import { FormControl, Button } from "react-bootstrap";
import {
  FaSortAlphaDown,
  FaSortAlphaUp,
  FaSortAmountDown,
  FaSortAmountUp,
  FaRegStickyNote,
} from "react-icons/fa";

import { API_BASE_URL } from "../App/config";

// Format date as "Jun 20"
const formatDate = (date) => {
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
};

function NotePanel() {
  // Simulated notes

  const [notes, setNotes] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOption, setSortOption] = useState("newest");
  const [selectedNoteId, setSelectedNoteId] = useState(null);

  useEffect(() => {
    // Fetch notes from backend
    const fetchNotes = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/note/all`);
        if (!response.ok) throw new Error("Failed to fetch notes");
        const data = await response.json();
        setNotes(data);
      } catch (err) {
        console.error("Error loading notes:", err);
      }
    };

    fetchNotes();
  }, []);

  const cycleSortOption = () => {
    const options = ["az", "za", "newest", "oldest"];
    const nextIndex = (options.indexOf(sortOption) + 1) % options.length;
    setSortOption(options[nextIndex]);
  };

  const getSortIcon = () => {
    switch (sortOption) {
      case "az":
        return <FaSortAlphaDown style={{ cursor: "pointer" }} />;
      case "za":
        return <FaSortAlphaUp style={{ cursor: "pointer" }} />;
      case "newest":
        return <FaSortAmountDown style={{ cursor: "pointer" }} />;
      case "oldest":
        return <FaSortAmountUp style={{ cursor: "pointer" }} />;
      default:
        return null;
    }
  };

  const filteredNotes = notes
    .filter((note) =>
      note.title.toLowerCase().includes(searchQuery.toLowerCase()),
    )
    .sort((a, b) => {
      if (sortOption === "az") return a.title.localeCompare(b.title);
      if (sortOption === "za") return b.title.localeCompare(a.title);
      if (sortOption === "newest") return b.updatedAt - a.updatedAt;
      if (sortOption === "oldest") return a.updatedAt - b.updatedAt;
      return 0;
    });

  const handleNewNote = () => {
    // Later: implement actual note creation logic
    alert("Create new note (functionality not yet implemented)");
  };

  return (
    <div>
      <div
        className="d-flex flex-column bg-light vh-100 border-end"
        style={{ width: "18rem" }}
      >
        {/* Title + sort icon */}
        <div className="d-flex justify-content-between align-items-center px-2 mb-2">
          <div className="fw-bold" style={{ fontSize: "1rem" }}>
            Notes
          </div>
          <div onClick={cycleSortOption} style={{ fontSize: "0.8rem" }}>
            {getSortIcon()}
          </div>
        </div>

        {/* Search input */}
        <div className="px-2 mb-2">
          <FormControl
            size="sm"
            type="text"
            placeholder="Search notes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ fontSize: "0.7rem" }}
          />
        </div>

        {/* New+ Button */}
        <div className="px-3 mb-2">
          <Button
            variant="success"
            size="sm"
            className="w-50 d-flex justify-content-center
            align-items-center gap-2"
            onClick={handleNewNote}
            style={{ height: "3rem" }}
          >
            <FaRegStickyNote />
            <span>New+</span>
          </Button>
        </div>

        {/* Display selected ID (debug) */}
        <div>
          <h1>{selectedNoteId}</h1>
        </div>

        {/* Scrollable note list */}
        <div
          className="flex-grow-1 overflow-auto"
          style={{ fontSize: "0.6rem" }}
        >
          {filteredNotes.map((note) => (
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
