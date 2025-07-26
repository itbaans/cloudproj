import React from "react";
import "./styles.css";

const NoteCard = ({ note, onClick }) => {
  const getColorClass = (color) => {
    return `note-${color}`;
  };

  const getIndicatorClass = (color) => {
    return `color-indicator color-indicator-${color}`;
  };

  return (
    <div 
      className={`note-card ${getColorClass(note.color)} slide-up`}
      onClick={onClick}
    >
      <div className={getIndicatorClass(note.color)} />
      
      <h3 className="note-title">
        {note.title}
      </h3>
      
      <p className="note-content">
        {note.content}
      </p>
      
      <div className="note-footer">
        <span className="note-date">
          {note.date}
        </span>
        
        <div className="note-actions">
          <button 
            className="icon-button"
            onClick={(e) => {
              e.stopPropagation();
              // Edit functionality would go here
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default NoteCard;
