import React, { useEffect, useRef, useState } from "react";
import "./EditableHeading.css"; // Import the CSS file

const EditableHeading = ({ value, onSave }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [text, setText] = useState(value);
  const inputRef = useRef(null);

  useEffect(() => {
    setText(value); // Update if note changes
  }, [value]);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      // inputRef.current.select();
    }
  }, [isEditing]);

  const handleSave = () => {
    setIsEditing(false);
    if (text !== value) onSave(text);
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
      <div
        className="editable-heading-display"
        onClick={() => setIsEditing(true)}
        title="Click to rename"
      >
        {text}
      </div>
    )}
  </div>
);
};

export default EditableHeading;
