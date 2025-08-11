import React from "react";
import { render, screen } from "@testing-library/react";
import TextEditor from "../TextEditor/TextEditor";

// Mock Quill to avoid heavy DOM/Canvas deps
jest.mock("quill", () => {
  return jest.fn().mockImplementation(() => ({
    root: { innerHTML: "" },
    on: jest.fn(),
    off: jest.fn(),
    getModule: jest.fn(() => ({ bindings: {} })),
    history: { undo: jest.fn(), redo: jest.fn() },
  }));
});

// Mock AuthContext
jest.mock("../Authentication/AuthContext", () => ({
  useAuth: () => ({
    token: "mock-token",
  }),
}));

// Mock NoteContext
jest.mock("../Components/NoteContext", () => ({
  useNote: () => ({
    selectedNoteId: mockSelectedNoteId,
    setSelectedNoteId: jest.fn(),
    selectedNoteName: "Test Note",
    setSelectedNoteName: jest.fn(),
    refreshNotes: false,
    setRefreshNotes: jest.fn(),
  }),
}));

// We need a mutable variable for different tests
let mockSelectedNoteId = null;

describe("TextEditor Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders 'No Note Selected' when no note is chosen", () => {
    mockSelectedNoteId = null;
    render(<TextEditor />);
    expect(screen.getByText(/No Note Selected/i)).toBeInTheDocument();
    expect(
      screen.getByText(/Please select a note to start editing/i)
    ).toBeInTheDocument();
  });

  it("renders editor container when a note is selected", () => {
    mockSelectedNoteId = "note-123";
    render(<TextEditor />);
    expect(screen.getByText(/Test Note/i)).toBeInTheDocument(); // EditableHeading
    expect(screen.getByRole("textbox")).toBeInTheDocument(); // Quill root div with contentEditable=true
  });
});
