// src/Layout.js
import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../Components/Sidebar'; // <- adjust path if needed
import { useAuth } from '../Authentication/AuthContext';

const Layout = () => {
  const { isLoggedIn } = useAuth();

  return (
    <div className="d-flex flex-row">
      {isLoggedIn && <Sidebar />}
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
