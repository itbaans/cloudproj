import React from "react";
import "./styles.css";

const Header = ({ userName }) => {
  return (
    <div className="dashboard-header">
      <h1 className="welcome-heading fade-in">Welcome back, {userName}</h1>
    </div>
  );
};

export default Header;
