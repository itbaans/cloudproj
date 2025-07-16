import React, { useEffect, useRef, useState } from "react";

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
      inputRef.current.select();
    }
  }, [isEditing]);

  const handleSave = () => {
    setIsEditing(false);
    if (text !== value) onSave(text);
  };

  return isEditing ? (
    <input
      ref={inputRef}
      className="text-2xl font-bold border-b border-gray-300 outline-none mb-4"
      value={text}
      onChange={(e) => setText(e.target.value)}
      onBlur={handleSave}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === "Escape") handleSave();
      }}
    />
  ) : (
    <h2
      className="text-2xl font-bold cursor-pointer mb-4"
      onClick={() => setIsEditing(true)}
    >
      {text || "Untitled"}
    </h2>
  );
};

export default EditableHeading;