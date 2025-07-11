import React, { useEffect, useRef, useState } from "react";
import Quill from "quill";
import "quill/dist/quill.snow.css";
import CustomToolbar from "./CustomToolbar";
import SettingsModule from "./SettingsModule"

const TextEditor = () => {
  const editorRef = useRef(null);
  const quillInstance = useRef(null);

  const [savedHTML, setSavedHTML] = useState(""); // Last saved version
  const [editorContent, setEditorContent] = useState(""); // Current editor text
  // Setup fonts
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
          settings: true
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
      undoButton.addEventListener("click", () => quillInstance.current.history.undo());
    }
    if (redoButton) {
      redoButton.addEventListener("click", () => quillInstance.current.history.redo());
    }

      // Making sure that after "enter" options are still active and displayed
      var keyboard = quillInstance.current.getModule("keyboard");
      delete keyboard.bindings[13];
    }

    const quill = quillInstance.current;

  const exportAsPDF = () => {
    import("html2pdf.js").then((html2pdf) => {
      html2pdf.default()
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
  // To be implmemnted with the backend
  // // Save instantly on every keystroke
  // useEffect(() => {
  //   if (!editorContent) return;

  //   setSavedHTML(editorContent); // Save it
  //   console.log("Saved after keystroke:", editorContent);

  //   // backend call
  //   fetch("http://localhost:5000/note/save", {
  //     method: "POST",
  //     headers: { "Content-Type": "application/json" },
  //     body: JSON.stringify({ html: editorContent }),
  //   });
  // }, [editorContent]);

  // // Save when tab/window is closed
  // useEffect(() => {
  //   const handleBeforeUnload = () => {
  //     if (quillInstance.current) {
  //       const html = quillInstance.current.root.innerHTML;
  //       console.log("💾 Forced save on unload:", html);

  //       // Optional: sync before exit
  //       // navigator.sendBeacon("/api/save", JSON.stringify({ html }));
  //     }
  //   };

  //   window.addEventListener("beforeunload", handleBeforeUnload);
  //   return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  // }, []);

  return (
    <div
      style={{
        padding: "1rem",
        width: "100%",
        maxWidth: "100%",
        boxSizing: "border-box",
      }}
    >
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
