import React from "react";
import "./styles.css";

const FilterControls = ({
  sortBy,
  setSortBy,
  sortOrder,
  setSortOrder
}) => {
  return (
    <div className="filter-inline">
      <label className="filter-label">Sort by:</label>
      <select
        value={sortBy}
        onChange={(e) => setSortBy(e.target.value)}
        className="filter-select"
      >
        <option value="date">Date</option>
        <option value="title">Title</option>
      </select>

      <label className="filter-label">Order:</label>
      <select
        value={sortOrder}
        onChange={(e) => setSortOrder(e.target.value)}
        className="filter-select"
      >
        <option value="desc">
          {sortBy === "title" ? "Z-A" : "Newest"}
        </option>
        <option value="asc">
          {sortBy === "title" ? "A-Z" : "Oldest"}
        </option>
      </select>
    </div>
  );
};

export default FilterControls;
