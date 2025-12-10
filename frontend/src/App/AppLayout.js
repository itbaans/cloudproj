// src/Layout.js
import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../Components/Sidebar'; // <- adjust path if needed
import ChatButton from '../Components/ChatButton';
import ChatAssistant from '../Components/ChatAssistant/ChatAssistant';
import { ChatProvider } from '../Components/ChatAssistant/ChatContext';
import { useAuth } from '../Authentication/AuthContext';

const Layout = () => {
  const { isLoggedIn } = useAuth();

  return (
    <ChatProvider>
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
    </ChatProvider>
  );
};

export default Layout;
