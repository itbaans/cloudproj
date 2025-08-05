import React from "react";
import { FiSearch, FiFileText } from "react-icons/fi"; // Feather icons
import "./styles.css";

const EmptyState = ({ searchTerm,}) => {
  const isFiltered = searchTerm

  return (
    <div className="empty-state fade-in">
      <div className="empty-state-icon scale-in">
        {isFiltered ? <FiSearch size={128} /> : <FiFileText size={128} />}
      </div>

      <h3 className="empty-state-title slide-up">
        {isFiltered ? "No notes found" : "No notes yet"}
      </h3>

      <p className="empty-state-text slide-up">
        {isFiltered
          ? "Try adjusting your search or filters to find what you're looking for."
          : "Create your first note to get started with your personal note collection."}
      </p>

      {!isFiltered && (
        <button className="create-note-btn slide-up">
          Create New Note
        </button>
      )}
    </div>
  );
};

export default EmptyState;
