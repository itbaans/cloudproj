import React from "react";
import "./CustomToolbar.css";
import FontDropdown from "./FontDropdown.js"
import FontSizeDropdown from "./FontSizeDropdown.js"
const CustomToolbar = ( {quill}) => {
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

  // const fontSizes = [
  //   { label: "10", value: "10px" },
  //   { label: "12", value: "12px" },
  //   { label: "14", value: "14px" },
  //   { label: "16", value: "16px" },
  //   { label: "18", value: "18px" },
  //   { label: "24", value: "24px" },
  //   { label: "32", value: "32px" },
  //   { label: "48", value: "48px" },
  // ];

  return (
    <div id="custom-toolbar" className="custom-toolbar-expanded">
      {/*  Undo/Redo */}
      <div className="toolbar-group">
        <button className="ql-undo">↶</button>
        <button className="ql-redo">↷</button>
      </div>

      {/* Font Options */}
      <div className="toolbar-group">
        <FontDropdown quill={quill} />

        <FontSizeDropdown quill={quill} />

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
    </div>
  );
};

export default CustomToolbar;
