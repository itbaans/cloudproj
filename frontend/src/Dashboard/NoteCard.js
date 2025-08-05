import React from "react";
import "./styles.css";
import { FaPlus } from "react-icons/fa";<FaPlus />

const NoteCard = ({ note = {}, onClick, isAddCard = false }) => {
  if (isAddCard) {
    return (
      <div className="note-card add-card" onClick={onClick}>
        <div className="add-icon">
          <FaPlus />
        </div>
      </div>
    );
  }

  return (
    <div className="note-card slide-up" onClick={onClick}>
      <h3 className="note-title">{note.title}</h3>

      <p className="note-content">{note.content}</p>

      <div className="note-footer">
        <span className="note-date">{note.date}</span>

        <div className="note-actions">
          <button
            className="icon-button"
            onClick={(e) => {
              e.stopPropagation();
              // Edit functionality would go here
            }}
          ></button>
        </div>
      </div>
    </div>
  );
};

export default NoteCard;
