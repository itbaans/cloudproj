import React, { useMemo } from "react";
import "./styles.css";

const Header = ({ userName, viewMode, setViewMode }) => {
  const getTimeOfDay = () => {
    const hour = new Date().getHours();
    return hour >= 6 && hour < 18 ? "day" : "night";
  };

  const dayGreetings = [
    "Good morning,",
    "Welcome back,",
    "Top of the morning,",
    "Hello again,",
    "Hey there,"
  ];

  const nightGreetings = [
    "Good evening,",
    "Welcome back,",
    "Evening vibes,",
    "Hello again,",
    "Hey there,"
  ];

  const generalGreetings = [
    "Welcome back,",
    "Glad to see you,",
    "You're back!",
    "Welcome aboard,",
    "Nice to have you back,"
  ];

  const greeting = useMemo(() => {
    const time = getTimeOfDay();
    const pool = [...generalGreetings, ...(time === "day" ? dayGreetings : nightGreetings)];
    return pool[Math.floor(Math.random() * pool.length)];
  }, []);

  return (
    <div className="dashboard-header">
      <h1 className="welcome-heading fade-in">{greeting} {userName}</h1>
      {setViewMode && (
        <div className="view-toggle">
          <button
            className={`view-toggle-btn ${viewMode === 'grid' ? 'active' : ''}`}
            onClick={() => setViewMode('grid')}
            title="Grid View"
          >
            ⊞ Grid
          </button>
          <button
            className={`view-toggle-btn ${viewMode === 'graph' ? 'active' : ''}`}
            onClick={() => setViewMode('graph')}
            title="Graph View"
          >
            🕸️ Network
          </button>
        </div>
      )}
    </div>
  );
};

export default Header;
