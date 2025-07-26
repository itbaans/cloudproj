import React, { useState, useMemo, useCallback } from "react";
import Header from "./Header";
import SearchBar from "./SearchBar";
import FilterControls from "./FilterControls";
import NotesGrid from "./NotesGrid";
import EmptyState from "./EmptyState";
import "./styles.css";

const Dashboard = ({
  userName = "Sarah",
  backgroundColor = "#F5F5F5",
  headerColor = "#000000",
  searchPlaceholder = "Search notes...",
  gridColumns = 5,
  gridGap = 20,
  userNameFont = {
    fontSize: "32px",
    fontWeight: "bold",
    letterSpacing: "-0.03em",
    lineHeight: "1em",
    fontFamily: "sans-serif",
  },
  searchFont = {
    fontSize: "15px",
    fontWeight: "500",
    letterSpacing: "-0.01em",
    lineHeight: "1.3em",
    fontFamily: "sans-serif",
  },
  noteFont = {
    fontSize: "15px",
    fontWeight: "500",
    letterSpacing: "-0.01em",
    lineHeight: "1.3em",
    fontFamily: "sans-serif",
  },
  notes = [],
  style = {
  },
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("date");
  const [sortOrder, setSortOrder] = useState("desc");
  const [filterColor, setFilterColor] = useState("all");
  const [showFilters, setShowFilters] = useState(false);
  const [isAddingNote, setIsAddingNote] = useState(false);

  const handleSearchChange = useCallback((e) => {
    setSearchTerm(e.target.value);
  }, []);

  const noteColors = {
    yellow: "#FFF9C4",
    blue: "#E3F2FD",
    green: "#E8F5E8",
    pink: "#FCE4EC",
    purple: "#F3E5F5",
    orange: "#FFF3E0",
  };

  const colorOptions = [
    { value: "all", label: "All Colors", color: "#E0E0E0" },
    { value: "yellow", label: "Yellow", color: "#FFF9C4" },
    { value: "blue", label: "Blue", color: "#E3F2FD" },
    { value: "green", label: "Green", color: "#E8F5E8" },
    { value: "pink", label: "Pink", color: "#FCE4EC" },
    { value: "purple", label: "Purple", color: "#F3E5F5" },
    { value: "orange", label: "Orange", color: "#FFF3E0" },
  ];





  const filteredAndSortedNotes = useMemo(() => {
    let filtered = notes;

    // Apply search filter
    if (searchTerm.trim()) {
      filtered = filtered.filter(
        (note) =>
          note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          note.content.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply color filter
    if (filterColor !== "all") {
      filtered = filtered.filter((note) => note.color === filterColor);
    }
    

    // Apply sorting
    const sorted = [...filtered].sort((a, b) => {
      let comparison = 0;

      switch (sortBy) {
        case "title":
          comparison = a.title.localeCompare(b.title);
          break;
        case "color":
          comparison = a.color.localeCompare(b.color);
          break;
        case "date":
        default:
          // Simple date comparison - in real app you'd parse actual dates
          const dateOrder = [
            "Today",
            "Yesterday",
            "2 days ago",
            "3 days ago",
            "1 week ago",
          ];
          const aIndex = dateOrder.indexOf(a.date);
          const bIndex = dateOrder.indexOf(b.date);
          comparison =
            (aIndex === -1 ? 999 : aIndex) - (bIndex === -1 ? 999 : bIndex);
          break;
      }

      return sortOrder === "asc" ? comparison : -comparison;
    });

    return sorted;
  }, [notes, searchTerm, sortBy, sortOrder, filterColor]);

  const handleAddNote = useCallback(() => {
    setIsAddingNote(true);
    // In a real app, this would open a modal or navigate to a new note page
    console.log("Adding new note");
    // For demo purposes, we'll just log this
    setTimeout(() => setIsAddingNote(false), 1000);
  }, []);

  return (
    <div
      className="notes-dashboard"
      style={{
        ...style,
        backgroundColor
      }}
    >
      {/* Header with User Name */}
      <Header 
        userName={userName}
        headerColor={headerColor}
        userNameFont={userNameFont}
        searchFont={searchFont}
        filteredAndSortedNotes={filteredAndSortedNotes}
        onAddNote={handleAddNote}
      />

      {/* Search Bar and Controls */}
      <div className="search-container">
        {/* Search Bar with Filter Toggle */}
        <SearchBar 
          searchTerm={searchTerm}
          handleSearchChange={handleSearchChange}
          showFilters={showFilters}
          setShowFilters={setShowFilters}
          searchPlaceholder={searchPlaceholder}
        />

        {/* Filter and Sort Controls */}
        <FilterControls 
          showFilters={showFilters}
          sortBy={sortBy}
          setSortBy={setSortBy}
          sortOrder={sortOrder}
          setSortOrder={setSortOrder}
          filterColor={filterColor}
          setFilterColor={setFilterColor}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          colorOptions={colorOptions}
        />
      </div>

      {/* Notes Grid or Empty State */}
      {filteredAndSortedNotes.length > 0 ? (
        <NotesGrid 
          filteredAndSortedNotes={filteredAndSortedNotes}
          gridGap={gridGap}
        />
      ) : (
        <EmptyState 
          searchTerm={searchTerm}
          filterColor={filterColor}
        />
      )}
    </div>
  );
};

export default Dashboard;
