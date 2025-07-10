import { createContext, useContext, useState } from "react";

const NoteContext = createContext();

export const NoteProvider = ({ children }) => {
  const [selectedNoteId, setSelectedNoteId] = useState(null);

  return (
    <NoteContext.Provider value={{ selectedNoteId, setSelectedNoteId }}>
      {children}
    </NoteContext.Provider>
  );
};

export const useNote = () => useContext(NoteContext);
