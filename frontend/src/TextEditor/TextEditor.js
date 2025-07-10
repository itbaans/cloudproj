import React, { useEffect, useRef, useState } from "react";
import Quill from "quill";
import "quill/dist/quill.snow.css";
import CustomToolbar from "./CustomToolbar";
import { useAuth } from "../Authentication/AuthContext";
import { useNote } from "../Components/NoteContext";
import { API_BASE_URL } from "../App/config";

const TextEditor = () => {
  const editorRef = useRef(null);
  const quillInstance = useRef(null);

  const [savedHTML, setSavedHTML] = useState(""); // Last saved version
  const [editorContent, setEditorContent] = useState(""); // Current editor text
  const { token } = useAuth();
  const { selectedNoteId } = useNote();
  // Setup fonts and sizes
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

  // Initialize Quill once
  useEffect(() => {
    if (editorRef.current && !quillInstance.current) {
      quillInstance.current = new Quill(editorRef.current, {
        theme: "snow",
        modules: {
          toolbar: "#custom-toolbar",
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
        ],
      });

      // Format application fix
      quillInstance.current.on("selection-change", (range) => {
        if (range && range.length === 0) {
          const format = quillInstance.current.getFormat(range.index - 1);
          Object.entries(format).forEach(([key, value]) => {
            quillInstance.current.format(key, value);
          });
        }
      });

      // Track live content
      quillInstance.current.on("text-change", () => {
        const html = quillInstance.current.root.innerHTML;
        setEditorContent(html);
      });
    }
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

  // Backend LOAD and SAVE features here

  // // Save instantly on every keystroke
  useEffect(() => {
    if (!editorContent) return;

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
      }}
    >
      {/*Here I want to implement a frontend feature to change the name of the file and to use this as a standard heading at the same time*/}
      <h2>#Note_Name API#</h2>

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
