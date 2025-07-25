import React from "react";
import "./CustomToolbar.css";

const CustomToolbar = () => {
  const fonts = [
    { label: "Arial", value: "arial" },
    { label: "Verdana", value: "verdana" },
    { label: "Georgia", value: "georgia" },
    { label: "Courier New", value: "courier-new" },
    { label: "Times New Roman", value: "times-new-roman" },
    { label: "Lucida", value: "lucida" },
    { label: "Impact", value: "impact" },
    { label: "Tahoma", value: "tahoma" },
    { label: "Trebuchet", value: "trebuchet" },
    { label: "Palatino", value: "palatino" },
    { label: "Monospace", value: "monospace" },
    { label: "Sans Serif", value: "sans-serif" },
    { label: "Serif", value: "serif" },
  ];

  const fontSizes = [
    { label: "10", value: "10px" },
    { label: "12", value: "12px" },
    { label: "14", value: "14px" },
    { label: "16", value: "16px" },
    { label: "18", value: "18px" },
    { label: "24", value: "24px" },
    { label: "32", value: "32px" },
    { label: "48", value: "48px" },
  ];

  return (
    <div id="custom-toolbar" className="custom-toolbar-expanded">
      {/*  Undo/Redo */}
      <div className="toolbar-group">
        <button className="ql-undo">↶</button>
        <button className="ql-redo">↷</button>
      </div>

      {/* Font Options */}
      <div className="toolbar-group">
        <select className="ql-font" defaultValue="sans-serif">
          {fonts.map((font) => (
            <option key={font.value} value={font.value}>
              {font.label}
            </option>
          ))}
        </select>

        {/* Font Sizes*/}
        <select className="ql-size" defaultValue="14px">
          {fontSizes.map((size) => (
            <option key={size.value} value={size.value}>
              {size.label}
            </option>
          ))}
        </select>
      </div>

      {/* Text Styles */}
      <div className="toolbar-group">
        <button className="ql-bold" />
        <button className="ql-italic" />
        <button className="ql-underline" />
        <button className="ql-strike" />
      </div>

      {/* Colors */}
      <div className="toolbar-group">
        <select className="ql-color" />
        <select className="ql-background" />
      </div>

      {/* Lists */}
      <div className="toolbar-group">
        <button className="ql-list" value="ordered" />
        <button className="ql-list" value="bullet" />
      </div>

      {/* Alignments */}
      <div className="toolbar-group">
        <button className="ql-align" value="" />
        <button className="ql-align" value="center" />
        <button className="ql-align" value="right" />
        <button className="ql-align" value="justify" />
      </div>

      {/* Advanced Formatting */}
      <div className="toolbar-group">
        <button className="ql-blockquote" />
        <button className="ql-code-block" />
        <button className="ql-direction" value="rtl" />
        <button className="ql-indent" value="-1" />
        <button className="ql-indent" value="+1" />
        <button className="ql-clean" />
      </div>

      {/* Media */}
      <div className="toolbar-group">
        <button className="ql-link" />
        <button className="ql-image" />
      </div>

      {/*<div className="toolbar-group export-dropdown">
        <select  key={Date.now()}
          onChange={(e) => {
            const value = e.target.value;
            if (value === "pdf")
              window.dispatchEvent(new CustomEvent("export-pdf"));
            if (value === "docx")
              window.dispatchEvent(new CustomEvent("export-docx"));
            if (value === "txt")
              window.dispatchEvent(new CustomEvent("export-txt"));
            e.target.selectedIndex = 0; // Reset to "Export As"
          }}
        >
          <option>Export As</option>
          <option value="pdf">PDF</option>
          <option value="docx">DOCX</option>
          <option value="txt">Text</option>
        </select>
      </div>*/}
    </div>
  );
};

export default CustomToolbar;
