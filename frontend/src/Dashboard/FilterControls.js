import React from "react";
import "./styles.css";

const FilterControls = ({
  showFilters,
  sortBy,
  setSortBy,
  sortOrder,
  setSortOrder,
  searchTerm,
  setSearchTerm
}) => {
  if (!showFilters) return null;

  return (
    <div className="filter-controls slide-up">
      {/* Sort By */}
      <div className="filter-group">
        <label className="filter-label">
          Sort by:
        </label>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="filter-select"
        >
          <option value="date">Date</option>
          <option value="title">Title</option>
        </select>
      </div>

      {/* Sort Order */}
      <div className="filter-group">
        <label className="filter-label">
          Order:
        </label>
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


      
      {/* Clear Filters */}
      {(searchTerm) && (
        <button
          className="clear-filters-btn"
          onClick={() => {
            setSearchTerm("");
          }}
        >
          Clear Filters
        </button>
      )}
    </div>
  );
};

export default FilterControls;
