import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FaUserCircle, 
  FaHome, 
  FaStickyNote, 
  FaSignOutAlt,
  FaBook
} from 'react-icons/fa';
import './sidebar.css';
import {useAuth} from '../Authentication/AuthContext'

function Sidebar() {
  const [activeSection, setActiveSection] = useState('home');
  const navigate = useNavigate();
  const { logout } = useAuth();


  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleNavigation = (name) => {
    setActiveSection(name);
    navigate(`/${name}`);
  }

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <div className="logo-container">
          <FaBook className="logo-icon" />
          <h1 className="logo-text">Notes</h1>
        </div>
      </div>
      
      <div className="sidebar-content">
        {/* User Profile Section */}
        <div className="user-profile" onClick={() => navigate('/user')}>
          <div className="avatar-container">
            <FaUserCircle className="user-avatar" />
          </div>
          <div className="user-info">
            <div className="user-name">John Doe</div>
            <div className="user-status">Premium</div>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="nav-menu">
          <div className="menu-label">MENU</div>
          <ul>
            <li 
              className={`nav-item ${activeSection === 'home' ? 'active' : ''}`}
              onClick={() => handleNavigation('home')}
            >
              <div className="nav-item-content">
                <FaHome className="nav-icon" />
                <span>Dashboard</span>
              </div>
              {activeSection === 'home' && <div className="active-indicator"></div>}
            </li>
            <li 
              className={`nav-item ${activeSection === 'notes' ? 'active' : ''}`}
              onClick={() => handleNavigation('notes')}
            >
              <div className="nav-item-content">
                <FaStickyNote className="nav-icon" />
                <span>My Notes</span>
              </div>
              {activeSection === 'notes' && <div className="active-indicator"></div>}
            </li>
          </ul>
        </nav>
      </div>

      {/* Logout Button */}
      <div className="logout-container">
        <button className="logout-button" onClick={handleLogout}>
          <FaSignOutAlt className="logout-icon" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
}

export default Sidebar;
