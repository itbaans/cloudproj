import { createContext, useContext, useState } from "react";

const NoteContext = createContext();

export const NoteProvider = ({ children }) => {
  const [selectedNoteId, setSelectedNoteId] = useState(null);
  const [selectedNoteName, setSelectedNoteName] = useState(null);
  const [refreshNotes, setRefreshNotes] = useState(false);

  const resetNoteContext = () => {
    setSelectedNoteId(null);
    setSelectedNoteName(null);
    setRefreshNotes(false);
  };

  return (
    <NoteContext.Provider
      value={{
        selectedNoteId,
        setSelectedNoteId,
        selectedNoteName,
        setSelectedNoteName,
        refreshNotes,
        setRefreshNotes,
        resetNoteContext
      }}
    >
      {children}
    </NoteContext.Provider>
  );
};

export const useNote = () => useContext(NoteContext);
