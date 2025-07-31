import React, { useEffect, useRef, useState } from "react";
import { FiEdit3 } from "react-icons/fi"; // <-- Pencil icon
import "./EditableHeading.css";

const EditableHeading = ({ value, onSave }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [text, setText] = useState(value);
  const inputRef = useRef(null);

  useEffect(() => {
    setText(value);
  }, [value]);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  const handleSave = () => {
    setIsEditing(false);
    const trimmedText = text.trim();

    if (!trimmedText) {
      setText(value);
      return;
    }

    if (trimmedText !== value) {
      onSave(trimmedText);
    }
  };

  return (
    <div className="editable-heading-wrapper">
      {isEditing ? (
        <input
          ref={inputRef}
          className="editable-heading-input"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onBlur={handleSave}
          spellCheck={false}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSave();
          }}
        />
      ) : (
        <div className="editable-heading-display">
          <span>{text}</span>
          <FiEdit3
            className="edit-icon"
            onClick={() => setIsEditing(true)}
            title="Click to rename"
          />
        </div>
      )}
    </div>
  );
};

export default EditableHeading;
