import { createContext, useContext, useState } from "react";

const NoteContext = createContext();

export const NoteProvider = ({ children }) => {
  const [selectedNoteId, setSelectedNoteId] = useState(null);
  const [selectedNoteName, setSelectedNoteName] = useState(null);
  const [refreshNotes, setRefreshNotes] = useState(false);

  return (
    <NoteContext.Provider value={{ selectedNoteId, setSelectedNoteId, selectedNoteName, setSelectedNoteName, refreshNotes, setRefreshNotes }}>
      {children}
    </NoteContext.Provider>
  );
};

export const useNote = () => useContext(NoteContext);
