import React, { useState, useRef, useEffect } from 'react';
import './FontDropdown.css';

const FONTS = [
  { name: 'Arial', value: 'arial' },
  { name: 'Verdana', value: 'verdana' },
  { name: 'Georgia', value: 'georgia' },
  { name: 'Courier New', value: 'courier-new' },
  { name: 'Times New Roman', value: 'times-new-roman' },
  { name: 'Lucida', value: 'lucida' },
  { name: 'Impact', value: 'impact' },
  { name: 'Tahoma', value: 'tahoma' },
  { name: 'Trebuchet', value: 'trebuchet' },
  { name: 'Palatino', value: 'palatino' },
  { name: 'Monospace', value: 'monospace' },
  { name: 'Sans Serif', value: 'sans-serif' },
  { name: 'Serif', value: 'serif' },
];

const getFontName = (fontValue) => {
  const value = fontValue || 'arial';
  const font = FONTS.find(f => f.value === value);
  return font ? font.name : 'Arial';
};

const FontDropdown = ({ quill }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedFontName, setSelectedFontName] = useState('Arial');
  const dropdownRef = useRef(null);
  const ignoreSelectionChange = useRef(false);
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
        const fontName = getFontName(formats.font);
        setSelectedFontName(fontName);
      }
    };

    quill.on('selection-change', handler);
    return () => {
      quill.off('selection-change', handler);
    };
  }, [quill]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const toggleDropdown = () => setIsOpen(prev => !prev);

  const handleFontSelect = (fontName, fontValue) => {
    if (!quill) return;
    ignoreSelectionChange.current = true;

    setSelectedFontName(fontName);
    quill.format('font', fontValue);
    setIsOpen(false);
    quill.focus();
  };

  return (
    <div className="dropdown-container" ref={dropdownRef}>
      <div className={`dropdown-trigger ${isOpen ? 'active' : ''}`} onClick={toggleDropdown}>
        <span>{selectedFontName}</span>
        <div className="dropdown-arrow"></div>
      </div>
      {isOpen && (
        <div className="dropdown-menu show">
          {FONTS.map((font) => (
            <div
              key={font.value}
              className={`dropdown-item ${selectedFontName === font.name ? 'selected' : ''}`}
              onMouseDown={(e) => {
                e.preventDefault();
                handleFontSelect(font.name, font.value);
              }}
              style={{ fontFamily: font.value }}
            >
              {font.name}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FontDropdown;