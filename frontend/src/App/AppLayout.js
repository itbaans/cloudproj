// src/Layout.js
import React, { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from '../Components/Sidebar'; // <- adjust path if needed
import ChatButton from '../Components/ChatButton';
import ChatAssistant from '../Components/ChatAssistant/ChatAssistant';
import { ChatProvider, useChat } from '../Components/ChatAssistant/ChatContext';
import { useAuth } from '../Authentication/AuthContext';

const LayoutContent = () => {
  const { isLoggedIn } = useAuth();
  const { setCurrentLocation } = useChat();
  const location = useLocation();

  // Update current location in ChatContext when route changes
  useEffect(() => {
    if (location.pathname === '/home') {
      setCurrentLocation('home');
    } else if (location.pathname === '/notes') {
      setCurrentLocation('notes');
    } else if (location.pathname === '/tasks') {
      setCurrentLocation('tasks');
    } else if (location.pathname.startsWith('/notebooks')) {
      setCurrentLocation('notebooks');
    }
  }, [location.pathname, setCurrentLocation]);

  return (
    <div className="d-flex flex-row">
      {isLoggedIn && <Sidebar />}
      <main className="main-content">
        <Outlet />
      </main>
      {isLoggedIn && (
        <>
          <ChatButton />
          <ChatAssistant />
        </>
      )}
    </div>
  );
};

const Layout = () => {
  return (
    <ChatProvider>
      <LayoutContent />
    </ChatProvider>
  );
};

export default Layout;

