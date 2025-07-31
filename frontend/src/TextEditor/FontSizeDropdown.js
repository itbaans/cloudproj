import React, { useState, useRef, useEffect } from 'react';
import './FontSizeDropdown.css'; // We'll create this CSS file next

// --- Configuration ---
const PREDEFINED_SIZES = ['8', '9','10','11','12', '14', '16', '18', '20','22', '24','26', '28','32', '36', '48', '72'];
const MIN_SIZE = 8;
const MAX_SIZE = 96;
const DEFAULT_SIZE = '16'; // Quill's default size

const FontSizeDropdown = ({ quill }) => {
  const [isOpen, setIsOpen] = useState(false);
  // `currentSize` holds the value for the input, as a string.
  const [currentSize, setCurrentSize] = useState(DEFAULT_SIZE);
  const dropdownRef = useRef(null);
  const ignoreSelectionChange = useRef(false);

  // --- Synchronization with Quill Editor ---
  useEffect(() => {
    if (!quill) return;

    const handler = () => {
      if (ignoreSelectionChange.current) {
        ignoreSelectionChange.current = false;
        return;
      }
      const range = quill.getSelection();
      if (range) {
        const formats = quill.getFormat(range);
        // Quill returns size with "px" (e.g., "14px"), so we parse it.
        const size = formats.size ? parseFloat(formats.size) : DEFAULT_SIZE;
        setCurrentSize(String(size));
      }
    };

    quill.on('selection-change', handler);
    return () => quill.off('selection-change', handler);
  }, [quill]);

  // --- Dropdown Management ---
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // --- Core Logic: Applying the Size ---
  const applySize = (size) => {
    const validatedSize = validateAndFormatSize(size);
    if (!validatedSize || !quill) return;

    // Raise the flag to prevent the listener from firing
    ignoreSelectionChange.current = true;
    
    // Update the UI immediately
    setCurrentSize(validatedSize);
    
    // Command Quill to apply the format (with 'px')
    quill.format('size', `${validatedSize}px`);
    
    // Close dropdown and refocus editor
    setIsOpen(false);
    quill.focus();
  };
  
  // --- Input Validation ---
  const validateAndFormatSize = (size) => {
    const num = parseFloat(size);
    if (isNaN(num) || num < MIN_SIZE || num > MAX_SIZE) {
      return null; // Invalid
    }
    // Round to one decimal place
    const rounded = Math.round(num * 10) / 10;
    return String(rounded);
  };

  // --- Event Handlers ---
  const handleInputChange = (e) => {
    setCurrentSize(e.target.value);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      applySize(currentSize);
      e.target.blur(); // Unfocus the input
    }
  };
  
  const handleBlur = () => {
    // On blur, if the input is invalid, revert it to the last valid size from Quill
    const validatedSize = validateAndFormatSize(currentSize);
    if (!validatedSize) {
        const formats = quill.getFormat();
        const fallbackSize = formats.size ? parseFloat(formats.size) : DEFAULT_SIZE;
        setCurrentSize(String(fallbackSize));
    }
  }

  const handlePredefinedSelect = (size) => {
    applySize(size);
  };
return (
  <div className={`size-dropdown-container`} ref={dropdownRef}>
    <div className={`size-input-wrapper ${isOpen ? 'active' : ''}`}>
      <input
        type="text"
        className="size-input"
        value={currentSize}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        onBlur={handleBlur}
      />
      <div 
        className={`size-arrow-container ${isOpen ? 'active' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="size-dropdown-arrow"></div>
      </div>
    </div>

    {isOpen && (
      <div className="size-dropdown-menu show">
        {PREDEFINED_SIZES.map((size) => (
          <div
            key={size}
            className={`size-dropdown-item ${currentSize === size ? 'selected' : ''}`}
            onMouseDown={(e) => {
              e.preventDefault();
              handlePredefinedSelect(size);
            }}
          >
            {size}
          </div>
        ))}
      </div>
    )}
  </div>
);
};

export default FontSizeDropdown;