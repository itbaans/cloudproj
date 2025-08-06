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
          margin: "0 5px",
          padding: "5px 10px",
          background: i === currentPage ? "#333" : "#ccc",
          color: "#fff",
          border: "none",
          cursor: "pointer",
        }}
      >
        {i}
      </button>
    );
  }

  return <div style={{ marginTop: "20px", textAlign: "center" }}>{pages}</div>;
};

export default Pagination;
