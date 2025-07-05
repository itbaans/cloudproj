import React from "react";
import "./CustomToolbar.css";

const CustomToolbar = () => {
  return (
    <div id="custom-toolbar" className="custom-toolbar-expanded">
      
      {/* Font Options */}
      <div className="toolbar-group">
        <select className="ql-font" defaultValue="sans-serif">
          <option value="sans-serif">Sans-serif</option>
          <option value="serif">Serif</option>
          <option value="monospace">Mono</option>
          <option value="arial">Arial</option>
          <option value="verdana">Verdana</option>
          <option value="georgia">Georgia</option>
          <option value="courier-new">Courier</option>
          <option value="times-new-roman">Times</option>
          <option value="lucida">Lucida</option>
          <option value="impact">Impact</option>
          <option value="tahoma">Tahoma</option>
          <option value="palatino">Palatino</option>
          <option value="trebuchet">Trebuchet</option>
        </select>

        <select className="ql-size" defaultValue="14px">
          <option value="10px">10</option>
          <option value="12px">12</option>
          <option value="14px">14</option>
          <option value="16px">16</option>
          <option value="18px">18</option>
          <option value="24px">24</option>
          <option value="32px">32</option>
          <option value="48px">48</option>
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
    </div>
  );
};

export default CustomToolbar;
