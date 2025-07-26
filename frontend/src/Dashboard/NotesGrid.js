import React from "react";
import NoteCard from "./NoteCard";
import "./styles.css";

const NotesGrid = ({ 
  filteredAndSortedNotes,
  gridGap
}) => {
  return (
    <div
      className="notes-grid"
      style={{ gap: `${gridGap}px` }}
    >
      {filteredAndSortedNotes.map((note, index) => (
        <div key={`${note.id}-${index}`} className="note-wrapper">
          <NoteCard 
            note={note}
            onClick={() => console.log("Note clicked:", note.id)}
          />
        </div>
      ))}
    </div>
  );
};

export default NotesGrid;
