import React from "react";

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;

  const pages = [];

  for (let i = 1; i <= totalPages; i++) {
    pages.push(
      <button
        key={i}
        onClick={() => onPageChange(i)}
        style={{
          "margin-right": "4px",
          padding: "10px 15px",
          "border-radius": '10px',
          background: i === currentPage ? "#FFBF00" : "#ccc",
          color: "white",
          border: "none",
          cursor: "pointer",
        }}
      >
        {i}
      </button>
    );
  }

  return <div style={{ marginTop: "20px", textAlign: "right" }}>{pages}</div>;
};

export default Pagination;
