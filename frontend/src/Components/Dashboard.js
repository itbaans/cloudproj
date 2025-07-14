// Notes dashboard with user name, search, and grid layout for notes app
import { useState, useMemo, startTransition } from "react";

export default function NotesDashboard({
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
  notes = [
    {
      id: "1",
      title: "Meeting Notes",
      content:
        "Discussed project timeline and deliverables. Need to follow up with the design team about the new mockups.",
      color: "yellow",
      date: "Today",
    },
    {
      id: "2",
      title: "Shopping List",
      content: "Milk, Bread, Eggs, Apples, Chicken, Rice, Pasta, Tomatoes",
      color: "blue",
      date: "Yesterday",
    },
    {
      id: "3",
      title: "Book Ideas",
      content:
        "1. The art of minimalism\n2. Digital detox guide\n3. Productivity in remote work",
      color: "green",
      date: "2 days ago",
    },
    {
      id: "4",
      title: "Travel Plans",
      content:
        "Planning a trip to Japan next spring. Research best places to visit in Tokyo and Kyoto.",
      color: "pink",
      date: "3 days ago",
    },
    {
      id: "5",
      title: "Recipe Collection",
      content:
        "Pasta Carbonara: Eggs, Parmesan, Pancetta, Black Pepper, Spaghetti. Simple and delicious!",
      color: "purple",
      date: "1 week ago",
    },
    {
      id: "6",
      title: "Workout Routine",
      content:
        "Monday: Chest & Triceps\nTuesday: Back & Biceps\nWednesday: Legs\nThursday: Shoulders\nFriday: Cardio",
      color: "orange",
      date: "1 week ago",
    },
    {
      id: "1",
      title: "Meeting Notes",
      content:
        "Discussed project timeline and deliverables. Need to follow up with the design team about the new mockups.",
      color: "yellow",
      date: "Today",
    },
    {
      id: "2",
      title: "Shopping List",
      content: "Milk, Bread, Eggs, Apples, Chicken, Rice, Pasta, Tomatoes",
      color: "blue",
      date: "Yesterday",
    },
    {
      id: "3",
      title: "Book Ideas",
      content:
        "1. The art of minimalism\n2. Digital detox guide\n3. Productivity in remote work",
      color: "green",
      date: "2 days ago",
    },
    {
      id: "4",
      title: "Travel Plans",
      content:
        "Planning a trip to Japan next spring. Research best places to visit in Tokyo and Kyoto.",
      color: "pink",
      date: "3 days ago",
    },
    {
      id: "5",
      title: "Recipe Collection",
      content:
        "Pasta Carbonara: Eggs, Parmesan, Pancetta, Black Pepper, Spaghetti. Simple and delicious!",
      color: "purple",
      date: "1 week ago",
    },
    {
      id: "6",
      title: "Workout Routine",
      content:
        "Monday: Chest & Triceps\nTuesday: Back & Biceps\nWednesday: Legs\nThursday: Shoulders\nFriday: Cardio",
      color: "orange",
      date: "1 week ago",
    },
    {
      id: "4",
      title: "Travel Plans",
      content:
        "Planning a trip to Japan next spring. Research best places to visit in Tokyo and Kyoto.",
      color: "pink",
      date: "3 days ago",
    },
    {
      id: "5",
      title: "Recipe Collection",
      content:
        "Pasta Carbonara: Eggs, Parmesan, Pancetta, Black Pepper, Spaghetti. Simple and delicious!",
      color: "purple",
      date: "1 week ago",
    },
    {
      id: "6",
      title: "Workout Routine",
      content:
        "Monday: Chest & Triceps\nTuesday: Back & Biceps\nWednesday: Legs\nThursday: Shoulders\nFriday: Cardio",
      color: "orange",
      date: "1 week ago",
    },
    {
      id: "4",
      title: "Travel Plans",
      content:
        "Planning a trip to Japan next spring. Research best places to visit in Tokyo and Kyoto.",
      color: "pink",
      date: "3 days ago",
    },
    {
      id: "5",
      title: "Recipe Collection",
      content:
        "Pasta Carbonara: Eggs, Parmesan, Pancetta, Black Pepper, Spaghetti. Simple and delicious!",
      color: "purple",
      date: "1 week ago",
    },
    {
      id: "6",
      title: "Workout Routine",
      content:
        "Monday: Chest & Triceps\nTuesday: Back & Biceps\nWednesday: Legs\nThursday: Shoulders\nFriday: Cardio",
      color: "orange",
      date: "1 week ago",
    },
    {
      id: "4",
      title: "Travel Plans",
      content:
        "Planning a trip to Japan next spring. Research best places to visit in Tokyo and Kyoto.",
      color: "pink",
      date: "3 days ago",
    },
    {
      id: "5",
      title: "Recipe Collection",
      content:
        "Pasta Carbonara: Eggs, Parmesan, Pancetta, Black Pepper, Spaghetti. Simple and delicious!",
      color: "purple",
      date: "1 week ago",
    },
    {
      id: "6",
      title: "Workout Routine",
      content:
        "Monday: Chest & Triceps\nTuesday: Back & Biceps\nWednesday: Legs\nThursday: Shoulders\nFriday: Cardio",
      color: "orange",
      date: "1 week ago",
    },
    {
      id: "4",
      title: "Travel Plans",
      content:
        "Planning a trip to Japan next spring. Research best places to visit in Tokyo and Kyoto.",
      color: "pink",
      date: "3 days ago",
    },
    {
      id: "5",
      title: "Recipe Collection",
      content:
        "Pasta Carbonara: Eggs, Parmesan, Pancetta, Black Pepper, Spaghetti. Simple and delicious!",
      color: "purple",
      date: "1 week ago",
    },
    {
      id: "6",
      title: "Workout Routine",
      content:
        "Monday: Chest & Triceps\nTuesday: Back & Biceps\nWednesday: Legs\nThursday: Shoulders\nFriday: Cardio",
      color: "orange",
      date: "1 week ago",
    },
    {
      id: "4",
      title: "Travel Plans",
      content:
        "Planning a trip to Japan next spring. Research best places to visit in Tokyo and Kyoto.",
      color: "pink",
      date: "3 days ago",
    },
    {
      id: "5",
      title: "Recipe Collection",
      content:
        "Pasta Carbonara: Eggs, Parmesan, Pancetta, Black Pepper, Spaghetti. Simple and delicious!",
      color: "purple",
      date: "1 week ago",
    },
    {
      id: "6",
      title: "Workout Routine",
      content:
        "Monday: Chest & Triceps\nTuesday: Back & Biceps\nWednesday: Legs\nThursday: Shoulders\nFriday: Cardio",
      color: "orange",
      date: "1 week ago",
    },
  ],
  style = {},
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("date");
  const [sortOrder, setSortOrder] = useState("desc");
  const [filterColor, setFilterColor] = useState("all");
  const [showFilters, setShowFilters] = useState(false);

  const filteredAndSortedNotes = useMemo(() => {
    let filtered = notes;

    // Apply search filter
    if (searchTerm.trim()) {
      filtered = filtered.filter(
        (note) =>
          note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          note.content.toLowerCase().includes(searchTerm.toLowerCase()),
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

  const handleSearchChange = (e) => {
    startTransition(() => {
      setSearchTerm(e.target.value);
    });
  };

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

  return (
    <div
      style={{
        ...style,
        backgroundColor,
        padding: "32px",
        minHeight: "100%",
        display: "flex",
        flexDirection: "column",
        gap: "24px",
        position: "relative",
      }}
    >
      {/* Header with User Name */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "8px",
        }}
      >
        <h1
          style={{
            margin: 0,
            color: headerColor,
            ...userNameFont,
          }}
        >
          Welcome back, {userName}
        </h1>
        <div
          style={{
            color: headerColor,
            opacity: 0.7,
            ...searchFont,
          }}
        >
          {filteredAndSortedNotes.length}{" "}
          {filteredAndSortedNotes.length === 1 ? "note" : "notes"}
        </div>
      </div>

      {/* Search Bar and Controls */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "16px",
        }}
      >
        {/* Search Bar with Filter Toggle */}
        <div
          style={{
            display: "flex",
            gap: "12px",
            alignItems: "center",
          }}
        >
          <div
            style={{
              position: "relative",
              flex: 1,
            }}
          >
            <input
              type="text"
              placeholder={searchPlaceholder}
              value={searchTerm}
              onChange={handleSearchChange}
              style={{
                width: "100%",
                padding: "16px 20px",
                border: "1px solid #E0E0E0",
                borderRadius: "12px",
                backgroundColor: "#FFFFFF",
                outline: "none",
                transition: "border-color 0.2s ease",
                boxSizing: "border-box",
                ...searchFont,
              }}
              onFocus={(e) => {
                e.target.style.borderColor = "#2196F3";
                e.target.style.boxShadow = "0 0 0 3px rgba(33, 150, 243, 0.1)";
              }}
              onBlur={(e) => {
                e.target.style.borderColor = "#E0E0E0";
                e.target.style.boxShadow = "none";
              }}
            />
            <div
              style={{
                position: "absolute",
                right: "16px",
                top: "50%",
                transform: "translateY(-50%)",
                color: "#9E9E9E",
                pointerEvents: "none",
              }}
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
              </svg>
            </div>
          </div>

          {/* Filter Toggle Button */}
          <button
            onClick={() => startTransition(() => setShowFilters(!showFilters))}
            style={{
              padding: "16px",
              border: "1px solid #E0E0E0",
              borderRadius: "12px",
              backgroundColor: showFilters ? "#2196F3" : "#FFFFFF",
              color: showFilters ? "#FFFFFF" : "#666666",
              cursor: "pointer",
              transition: "all 0.2s ease",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              minWidth: "52px",
            }}
            onMouseEnter={(e) => {
              if (!showFilters) {
                e.currentTarget.style.backgroundColor = "#F5F5F5";
              }
            }}
            onMouseLeave={(e) => {
              if (!showFilters) {
                e.currentTarget.style.backgroundColor = "#FFFFFF";
              }
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M10 18h4v-2h-4v2zM3 6v2h18V6H3zm3 7h12v-2H6v2z" />
            </svg>
          </button>
        </div>

        {/* Filter and Sort Controls */}
        {showFilters && (
          <div
            style={{
              display: "flex",
              gap: "16px",
              padding: "20px",
              backgroundColor: "#FFFFFF",
              borderRadius: "12px",
              border: "1px solid #E0E0E0",
              flexWrap: "wrap",
              alignItems: "center",
            }}
          >
            {/* Sort By */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <label
                style={{
                  ...searchFont,
                  fontSize: "14px",
                  color: "#666666",
                  fontWeight: "500",
                }}
              >
                Sort by:
              </label>
              <select
                value={sortBy}
                onChange={(e) =>
                  startTransition(() => setSortBy(e.target.value))
                }
                style={{
                  padding: "8px 12px",
                  border: "1px solid #E0E0E0",
                  borderRadius: "8px",
                  backgroundColor: "#FFFFFF",
                  ...searchFont,
                  fontSize: "14px",
                  cursor: "pointer",
                }}
              >
                <option value="date">Date</option>
                <option value="title">Title</option>
                <option value="color">Color</option>
              </select>
            </div>

            {/* Sort Order */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <label
                style={{
                  ...searchFont,
                  fontSize: "14px",
                  color: "#666666",
                  fontWeight: "500",
                }}
              >
                Order:
              </label>
              <select
                value={sortOrder}
                onChange={(e) =>
                  startTransition(() => setSortOrder(e.target.value))
                }
                style={{
                  padding: "8px 12px",
                  border: "1px solid #E0E0E0",
                  borderRadius: "8px",
                  backgroundColor: "#FFFFFF",
                  ...searchFont,
                  fontSize: "14px",
                  cursor: "pointer",
                }}
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
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <label
                style={{
                  ...searchFont,
                  fontSize: "14px",
                  color: "#666666",
                  fontWeight: "500",
                }}
              >
                Filter:
              </label>
              <div
                style={{
                  display: "flex",
                  gap: "6px",
                  flexWrap: "wrap",
                }}
              >
                {colorOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() =>
                      startTransition(() => setFilterColor(option.value))
                    }
                    style={{
                      padding: "6px 12px",
                      border:
                        filterColor === option.value
                          ? "2px solid #2196F3"
                          : "1px solid #E0E0E0",
                      borderRadius: "20px",
                      backgroundColor: option.color,
                      cursor: "pointer",
                      transition: "all 0.2s ease",
                      ...searchFont,
                      fontSize: "12px",
                      fontWeight: filterColor === option.value ? "600" : "400",
                      color: "#333333",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = "scale(1.05)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = "scale(1)";
                    }}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Clear Filters */}
            {(filterColor !== "all" || searchTerm) && (
              <button
                onClick={() =>
                  startTransition(() => {
                    setFilterColor("all");
                    setSearchTerm("");
                  })
                }
                style={{
                  padding: "8px 16px",
                  border: "1px solid #FF5722",
                  borderRadius: "8px",
                  backgroundColor: "#FFFFFF",
                  color: "#FF5722",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                  ...searchFont,
                  fontSize: "14px",
                  fontWeight: "500",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "#FF5722";
                  e.currentTarget.style.color = "#FFFFFF";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "#FFFFFF";
                  e.currentTarget.style.color = "#FF5722";
                }}
              >
                Clear Filters
              </button>
            )}
          </div>
        )}
      </div>

      {/* Notes Grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${gridColumns}, 250px)`,
          gap: `${gridGap}px`,
          // flex: 1,
          width: `${gridColumns * 250 + gridGap * (gridColumns - 1)}px`, // total fixed width
          height: "1000px", // or any static height you want
          overflowY: "auto", // allows scroll if content overflows vertically
          overflowX: "hidden", // no horizontal scroll
        }}
      >
        {filteredAndSortedNotes.map((note) => (
          <div
            key={note.id}
            style={{
              backgroundColor: noteColors[note.color] || noteColors.yellow,
              borderRadius: "12px",
              padding: "20px",
              cursor: "pointer",
              transition: "transform 0.2s ease, box-shadow 0.2s ease",
              border: "1px solid rgba(0,0,0,0.05)",
              display: "flex",
              flexDirection: "column",
              height: "200px",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-2px)";
              e.currentTarget.style.boxShadow = "0 8px 25px rgba(0,0,0,0.1)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.05)";
            }}
          >
            <h3
              style={{
                margin: "0 0 12px 0",
                color: "#333333",
                ...noteFont,
                fontSize: "18px",
                fontWeight: "600",
                lineHeight: "1.3",
              }}
            >
              {note.title}
            </h3>
            <p
              style={{
                margin: "0 0 auto 0",
                color: "#666666",
                ...noteFont,
                fontSize: "14px",
                lineHeight: "1.5",
                overflow: "hidden",
                display: "-webkit-box",
                WebkitLineClamp: 6,
                WebkitBoxOrient: "vertical",
              }}
            >
              {note.content}
            </p>
            <div
              style={{
                marginTop: "16px",
                color: "#999999",
                ...noteFont,
                fontSize: "12px",
              }}
            >
              {note.date}
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredAndSortedNotes.length === 0 && (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            flex: 1,
            minHeight: "300px",
            color: "#9E9E9E",
            textAlign: "center",
          }}
        >
          <div style={{ fontSize: "48px", marginBottom: "16px" }}>📝</div>
          <h3
            style={{
              margin: "0 0 8px 0",
              ...noteFont,
              fontSize: "18px",
            }}
          >
            {searchTerm || filterColor !== "all"
              ? "No notes found"
              : "No notes yet"}
          </h3>
          <p style={{ margin: 0, ...noteFont, fontSize: "14px" }}>
            {searchTerm || filterColor !== "all"
              ? "Try adjusting your search or filters"
              : "Create your first note to get started"}
          </p>
        </div>
      )}
    </div>
  );
}
