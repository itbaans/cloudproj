import React from "react";
import "./styles.css";

const FilterControls = ({
  showFilters,
  sortBy,
  setSortBy,
  sortOrder,
  setSortOrder,
  filterColor,
  setFilterColor,
  searchTerm,
  setSearchTerm,
  colorOptions,
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
          <option value="color">Color</option>
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

      {/* Color Filter */}
      <div className="filter-group">
        <label className="filter-label">
          Filter:
        </label>
        <div className="color-filters">
          {colorOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => setFilterColor(option.value)}
              className={`color-filter-btn ${filterColor === option.value ? 'active' : ''}`}
              style={{ backgroundColor: option.color }}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {/* Clear Filters */}
      {(filterColor !== "all" || searchTerm) && (
        <button
          className="clear-filters-btn"
          onClick={() => {
            setFilterColor("all");
            setSearchTerm("");
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
          </svg>
          Clear Filters
        </button>
      )}
    </div>
  );
};

export default FilterControls;
