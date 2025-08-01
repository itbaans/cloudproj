import React, { useEffect, useRef, useState } from "react";
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
    <div className="editable-heading-wrapper" onClick={() => setIsEditing(true)}>
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
        <div className="editable-heading-display"
        
            title="Click to rename">
          <span>{text}</span>
        </div>
      )}
    </div>
  );
};

export default EditableHeading;
