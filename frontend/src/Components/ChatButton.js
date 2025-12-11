import React from "react";
import { useChat } from "./ChatAssistant/ChatContext";
import "./ChatButton.css";

const ChatButton = () => {
    const { toggleChat, isChatOpen, unreadCount, isViewingProtectedNote } = useChat();

    // Hide chat button when viewing protected notes
    if (isViewingProtectedNote) {
        return null;
    }

    return (
        <button
            className={`floating-chat-button ${isChatOpen ? "active" : ""}`}
            onClick={toggleChat}
            title="AI Assistant"
        >
            {isChatOpen ? "✕" : "💬"}
            {!isChatOpen && unreadCount > 0 && (
                <span className="chat-badge">{unreadCount}</span>
            )}
        </button>
    );
};

export default ChatButton;
