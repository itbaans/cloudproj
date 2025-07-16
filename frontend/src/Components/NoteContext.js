import { createContext, useContext, useState } from "react";

const NoteContext = createContext();

export const NoteProvider = ({ children }) => {
  const [selectedNoteId, setSelectedNoteId] = useState(null);
  const [selectedNoteName, setSelectedNoteName] = useState(null);

  return (
    <NoteContext.Provider value={{ selectedNoteId, setSelectedNoteId, selectedNoteName, setSelectedNoteName }}>
      {children}
    </NoteContext.Provider>
  );
};

export const useNote = () => useContext(NoteContext);
