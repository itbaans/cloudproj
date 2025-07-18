import React, { useEffect, useRef, useState } from "react";
import Quill from "quill";
import "quill/dist/quill.snow.css";
import CustomToolbar from "./CustomToolbar";
import { useAuth } from "../Authentication/AuthContext";
import { useNote } from "../Components/NoteContext";
import { API_BASE_URL } from "../App/config";
import SettingsModule from "./SettingsModule";
import EditableHeading from "./EditableHeading";

const TextEditor = () => {
  const editorRef = useRef(null);
  const quillInstance = useRef(null);

  const initialRender = useRef(true);
  const [editorContent, setEditorContent] = useState(""); // Current editor text
  // Setup fonts

  const { token } = useAuth();
  const { selectedNoteId } = useNote();
  const { selectedNoteName, setSelectedNoteName } = useNote();

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

  // Setup font sizes
  const Size = Quill.import("formats/size");
  Size.whitelist = [
    "10px",
    "12px",
    "14px",
    "16px",
    "18px",
    "24px",
    "32px",
    "48px",
  ];
  Quill.register(Size, true);

  // Initialize Quill
  useEffect(() => {
    if (editorRef.current && !quillInstance.current) {
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
    }

    const quill = quillInstance.current;

    const exportAsPDF = () => {
      import("html2pdf.js").then((html2pdf) => {
        html2pdf
          .default()
          .from(quill.root.innerHTML)
          .set({
            margin: 0.5,
            filename: "document.pdf",
            html2canvas: { scale: 2 },
            jsPDF: { unit: "in", format: "letter", orientation: "portrait" },
          })
          .save();
      });
    };

    const exportAsDocx = () => {
      import("html-docx-js/dist/html-docx").then((htmlDocx) => {
        const doc = htmlDocx.default.asBlob(quill.root.innerHTML);
        const url = URL.createObjectURL(doc);
        const link = document.createElement("a");
        link.href = url;
        link.download = "document.docx";
        link.click();
        URL.revokeObjectURL(url);
      });
    };

    const exportAsText = () => {
      const text = quill.getText();
      const blob = new Blob([text], { type: "text/plain" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "document.txt";
      link.click();
      URL.revokeObjectURL(url);
    };

    window.addEventListener("export-pdf", exportAsPDF);
    window.addEventListener("export-docx", exportAsDocx);
    window.addEventListener("export-txt", exportAsText);

    return () => {
      window.removeEventListener("export-pdf", exportAsPDF);
      window.removeEventListener("export-docx", exportAsDocx);
      window.removeEventListener("export-txt", exportAsText);
    };
  }, []);

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
  }, []);

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
    } catch (err) {
      console.error("Failed to update note title:", err);
    }
  };

  // Backend LOAD and SAVE features here

  // // Save instantly on every keystroke
  useEffect(() => {
    if (!editorContent) return;
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
  }, [editorContent]);

  return (
    <div
      style={{
        padding: "1rem",
        width: "100%",
        maxWidth: "100%",
        boxSizing: "border-box",
        height: "100%",
      }}
    >
      
     <EditableHeading value={selectedNoteName} onSave={handleSaveNoteName} />
  
    
      <CustomToolbar />

      <div
        ref={editorRef}
        style={{
          height: "calc(100vh - 250px)",
          marginBottom: "1rem",
          width: "100%",
          maxWidth: "100%",
          overflow: "auto",
        }}
      />
    </div>
  );
};

export default TextEditor;
