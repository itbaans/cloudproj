import React from "react";
import "./styles.css";

const Header = ({ 
  userName, 
  headerColor, 
  userNameFont, 
  searchFont, 
  filteredAndSortedNotes,
  onAddNote
}) => {
  return (
    <div className="dashboard-header">
      <h1
        className="welcome-heading fade-in"
        style={{
          color: headerColor,
          ...userNameFont,
        }}
      >
        Welcome back, {userName}
      </h1>

      <div className="dashboard-header-right fade-in">
        <div
          className="notes-count"
          style={{
            color: headerColor,
            opacity: 0.7,
            ...searchFont,
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M3 13h2v-2H3v2zm0 4h2v-2H3v2zm0-8h2V7H3v2zm4 4h14v-2H7v2zm0 4h14v-2H7v2zM7 7v2h14V7H7z" />
          </svg>
          {filteredAndSortedNotes.length}{" "}
          {filteredAndSortedNotes.length === 1 ? "note" : "notes"}
        </div>

        <button
          className="add-note-btn"
          onClick={onAddNote}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
          </svg>
          New Note
        </button>
      </div>
    </div>
  );
};

export default Header;
