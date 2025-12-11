import React, { useEffect, useRef, useState } from "react";
import Quill from "quill";
import "quill/dist/quill.snow.css";
import CustomToolbar from "./CustomToolbar";
import { useAuth } from "../Authentication/AuthContext";
import { useNote } from "../Components/NoteContext";
import { useChat } from "../Components/ChatAssistant/ChatContext";
import { API_BASE_URL } from "../App/config";
import SettingsModule from "./SettingsModule";
import EditableHeading from "./EditableHeading";
import "./TextEditor.css";

const TextEditor = () => {

  const editorRef = useRef(null);
  const quillInstance = useRef(null);
  const initialRender = useRef(true);
  const [editorContent, setEditorContent] = useState("");
  const [isProtected, setIsProtected] = useState(false);
  const [notebooks, setNotebooks] = useState([]);
  const [currentNotebookId, setCurrentNotebookId] = useState(null);

  const { token } = useAuth();
  const { selectedNoteId, setSelectedNoteId } = useNote();
  const { selectedNoteName, setSelectedNoteName } = useNote();
  const selectedNoteIdRef = useRef(selectedNoteId);
  const { refreshNotes, setRefreshNotes } = useNote();
  const { setCurrentNoteId, setIsViewingProtectedNote } = useChat();
  const autosave = useRef(false);

  // Update ChatContext with current note ID
  useEffect(() => {
    setCurrentNoteId(selectedNoteId);
  }, [selectedNoteId, setCurrentNoteId]);

  const Font = Quill.import("formats/font");
  Font.whitelist = [
    "arial",
    "verdana",
    "georgia",
    "courier-new",
    "times-new-roman",
    "lucida",
    "impact",
    "tahoma",
    "trebuchet",
    "palatino",
    "monospace",
    "sans-serif",
    "serif",
  ];

  Quill.register(Font, true);

  const Parchment = Quill.import("parchment");
  const SizeStyle = new Parchment.Attributor.Style("size", "font-size", {
    scope: Parchment.Scope.INLINE,
  });

  Quill.register(SizeStyle, true);
  useEffect(() => {
    if (selectedNoteId && editorRef.current && !quillInstance.current) {
      quillInstance.current = null;
      if (editorRef.current) {
        editorRef.current.innerHTML = "";
      }

      Quill.register("modules/settings", SettingsModule);
      quillInstance.current = new Quill(editorRef.current, {
        theme: "snow",
        modules: {
          toolbar: "#custom-toolbar",
          settings: true,
        },
        formats: [
          "font",
          "size",
          "color",
          "background",
          "bold",
          "italic",
          "underline",
          "strike",
          "align",
          "list",
          "link",
          "image",
          "blockquote",
          "code-block",
          "direction",
          "indent",
        ],
      });

      const undoButton = document.querySelector(".ql-undo");
      const redoButton = document.querySelector(".ql-redo");

      if (undoButton) {
        undoButton.addEventListener("click", () =>
          quillInstance.current.history.undo(),
        );
      }
      if (redoButton) {
        redoButton.addEventListener("click", () =>
          quillInstance.current.history.redo(),
        );
      }

      // Making sure that after "enter" options are still active and displayed
      var keyboard = quillInstance.current.getModule("keyboard");
      delete keyboard.bindings[13];

      // Expose Quill instance globally for bot actions
      window.quillInstance = quillInstance.current;
    }

    // Cleanup Quill instance when no note is selected
    if (!selectedNoteId && quillInstance.current) {
      quillInstance.current = null;
      if (editorRef.current) {
        editorRef.current.innerHTML = "";
      }
    }

    const handleDeleteNote = async () => {
      const idToDelete = selectedNoteIdRef.current;
      if (!idToDelete) return;
      try {
        await fetch(`${API_BASE_URL}/note/remove/${idToDelete}`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        setSelectedNoteId(null);
        // trigger a refetch
        setRefreshNotes((prev) => !prev);
      } catch (err) {
        console.error("Failed to delete note", err);
      }
    };

    const handleGetDocumentName = (e) => {
      window.dispatchEvent(
        new CustomEvent("document-name-response", {
          detail: {
            name: `${selectedNoteName}`,
          },
        }),
      );
    };
    const handleSave = () => {
      const idToSave = selectedNoteIdRef.current;
      if (!editorContent || !idToSave) return;
      const content = quillInstance.current.root.innerHTML;
      fetch(`${API_BASE_URL}/note/save/${idToSave}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },

        body: JSON.stringify({ ContentHTML: content }),
      });
      setRefreshNotes((prev) => !prev);
    };

    const handleChangeAutoSave = () => {
      autosave.current = !autosave.current;
      window.dispatchEvent(
        new CustomEvent("autosave-changed", {
          detail: autosave.current ? "On" : "Off",
        }),
      );
      if (autosave.current) handleSave();
    };

    window.addEventListener("auto-save", handleChangeAutoSave);
    window.addEventListener("manual-save", handleSave);
    window.addEventListener("delete-note", handleDeleteNote);
    window.addEventListener("get-document-name", handleGetDocumentName);
    return () => {
      window.removeEventListener("auto-save", handleChangeAutoSave);
      window.removeEventListener("manual-save", handleSave);
      window.removeEventListener("delete-note", handleDeleteNote);
      window.removeEventListener("get-document-name", handleGetDocumentName);
    };
  }, [
    selectedNoteId,
    setSelectedNoteId,
    token,
    editorContent,
    selectedNoteName,
    refreshNotes,
    setRefreshNotes
  ]);

  // Load protection status when note changes
  useEffect(() => {
    const loadProtectionStatus = async () => {
      if (!selectedNoteId || !token) {
        setIsProtected(false);
        return;
      }

      try {
        const response = await fetch(
          `${API_BASE_URL}/note/load/${selectedNoteId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const data = await response.json();
        setIsProtected(data.is_protected || false);
      } catch (err) {
        console.error("Error loading protection status:", err);
        setIsProtected(false);
      }
    };

    loadProtectionStatus();
  }, [selectedNoteId, token]);

  // Update ChatContext when protection status changes
  useEffect(() => {
    setIsViewingProtectedNote(isProtected);

    // Reset when component unmounts or note changes
    return () => {
      setIsViewingProtectedNote(false);
    };
  }, [isProtected, setIsViewingProtectedNote]);

  // Fetch all notebooks for the dropdown
  useEffect(() => {
    const fetchNotebooks = async () => {
      if (!token) return;

      try {
        const response = await fetch(`${API_BASE_URL}/notebooks`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();
        if (response.ok) {
          setNotebooks(data.notebooks || []);
        }
      } catch (err) {
        console.error("Error fetching notebooks:", err);
      }
    };

    fetchNotebooks();
  }, [token]);

  // Load current notebook ID when note changes
  useEffect(() => {
    const loadNoteDetails = async () => {
      if (!selectedNoteId || !token) {
        setCurrentNotebookId(null);
        return;
      }

      try {
        const response = await fetch(
          `${API_BASE_URL}/note/load/${selectedNoteId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const data = await response.json();
        setCurrentNotebookId(data.notebook_id || null);
      } catch (err) {
        console.error("Error loading note details:", err);
      }
    };

    loadNoteDetails();
  }, [selectedNoteId, token]);


  useEffect(() => {
    const quill = quillInstance.current;
    if (!quill) return;

    const handleChange = () => {
      const html = quill.root.innerHTML;
      setEditorContent(html);
    };

    quill.on("text-change", handleChange);

    return () => {
      quill.off("text-change", handleChange);
    };
  }, [selectedNoteId]);

  useEffect(() => {
    selectedNoteIdRef.current = selectedNoteId;
  }, [selectedNoteId]);

  useEffect(() => {
    if (!selectedNoteId) return;
    const fetchNoteHTML = async () => {
      try {
        const response = await fetch(
          `${API_BASE_URL}/note/load/${selectedNoteId}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          },
        );

        if (!response.ok) throw new Error("Failed to fetch notes");
        initialRender.current = true;
        const ContentHTML = await response.json();
        if (quillInstance.current) {
          quillInstance.current.root.innerHTML = ContentHTML.content_html; // set in Quill
        }
      } catch (err) {
        console.error("Error loading notes:", err);
      }
    };

    fetchNoteHTML();
  }, [selectedNoteId, token]);

  const handleSaveNoteName = async (newNoteName) => {
    setSelectedNoteName(newNoteName);

    try {
      await fetch(`${API_BASE_URL}/note/name/${selectedNoteId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ noteName: newNoteName }),
      });
      // trigger a refetch
      setRefreshNotes((prev) => !prev); // toggle to re-run effect
    } catch (err) {
      console.error("Failed to update note title:", err);
    }
  };

  const handleSave = () => {
    if (!editorContent || !selectedNoteId) return;
    if (initialRender.current) {
      initialRender.current = false;
      return;
    }
    fetch(`${API_BASE_URL}/note/save/${selectedNoteId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ ContentHTML: editorContent }),
    });
    setRefreshNotes((prev) => !prev);
  };

  // Handle notebook change
  const handleNotebookChange = async (e) => {
    const newNotebookId = e.target.value === "" ? null : parseInt(e.target.value);

    if (!selectedNoteId) return;

    try {
      const response = await fetch(
        `${API_BASE_URL}/note/notebook/${selectedNoteId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ notebookId: newNotebookId }),
        }
      );

      if (response.ok) {
        setCurrentNotebookId(newNotebookId);
        setRefreshNotes(!refreshNotes);
      } else {
        alert("Failed to move note to notebook");
      }
    } catch (err) {
      console.error("Error moving note:", err);
      alert("Error moving note to notebook");
    }
  };

  const toggleProtection = async () => {
    if (!selectedNoteId) return;

    const confirmMsg = isProtected
      ? "Unprotect this note? It will be included in AI features again."
      : "Protect this note? Content will be encrypted and excluded from AI features.";

    if (!window.confirm(confirmMsg)) return;

    try {
      const response = await fetch(
        `${API_BASE_URL}/note/protect/${selectedNoteId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ isProtected: !isProtected }),
        }
      );

      if (response.ok) {
        setIsProtected(!isProtected);
        setRefreshNotes(!refreshNotes);
        alert(`Note ${!isProtected ? 'protected' : 'unprotected'} successfully!`);
      } else {
        alert("Failed to toggle protection");
      }
    } catch (err) {
      console.error("Error toggling protection:", err);
      alert("Error toggling protection");
    }
  };

  // autosave on every keystroke
  useEffect(
    () => {
      if (!autosave.current) return;
      if (initialRender.current) {
        initialRender.current = false;
        return;
      }
      handleSave();
    },
    [editorContent],
    [autosave.current],
  );

  // Show message when no note is selected
  if (!selectedNoteId) {
    return (
      <div className="no-note-container">
        <div className="no-note-content">
          <h3>No Note Selected</h3>
          <p>Please select a note to start editing</p>
        </div>
      </div>
    );
  }

  return (
    <div className="editor-container slide-up">
      <div className="top-filler"> </div>
      <CustomToolbar quill={quillInstance.current} />
      <div className="editor-heading-bar">
        <EditableHeading value={selectedNoteName} onSave={handleSaveNoteName} />
        <div className="editor-actions">
          {notebooks.length > 0 && (
            <select
              className="notebook-selector"
              value={currentNotebookId || ""}
              onChange={handleNotebookChange}
              title="Move to notebook"
            >
              <option value="">No Notebook</option>
              {notebooks.map((notebook) => (
                <option key={notebook.id} value={notebook.id}>
                  📖 {notebook.notebook_name}
                </option>
              ))}
            </select>
          )}
          {selectedNoteId && (
            <button
              className={`protection-toggle-btn ${isProtected ? 'protected' : ''}`}
              onClick={toggleProtection}
              title={isProtected ? "Unprotect Note" : "Protect Note"}
            >
              {isProtected ? '🔓 Protected' : '🔒 Protect'}
            </button>
          )}
        </div>
      </div>
      <div className="editor-seperator"></div>
      <div ref={editorRef} className="editor-area" />
    </div>
  );
};

export default TextEditor;
