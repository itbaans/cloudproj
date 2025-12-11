import React, { createContext, useContext, useState, useEffect } from "react";
import { API_BASE_URL } from "../../App/config";

const ChatContext = createContext();

export const useChat = () => {
    const context = useContext(ChatContext);
    if (!context) {
        throw new Error("useChat must be used within a ChatProvider");
    }
    return context;
};

export const ChatProvider = ({ children }) => {
    const [isChatOpen, setIsChatOpen] = useState(false);
    const [currentConversationId, setCurrentConversationId] = useState(null);
    const [unreadCount, setUnreadCount] = useState(0);

    // Context mode is auto-set based on location
    const [contextMode, setContextMode] = useState('global'); // 'global' or 'local'
    const [currentNoteId, setCurrentNoteId] = useState(null);
    const [currentLocation, setCurrentLocation] = useState('home'); // 'home' or 'notes'
    const [isViewingProtectedNote, setIsViewingProtectedNote] = useState(false);

    const openChat = () => {
        setIsChatOpen(true);
        setUnreadCount(0);
    };

    const closeChat = () => {
        setIsChatOpen(false);
    };

    const toggleChat = () => {
        if (isChatOpen) {
            closeChat();
        } else {
            openChat();
        }
    };

    const startNewConversation = () => {
        setCurrentConversationId(null);
    };



    // Reset current conversation (clear messages)
    const resetCurrentChat = async () => {
        if (!currentConversationId) return;

        const token = localStorage.getItem("token");
        if (!token) return;

        try {
            const response = await fetch(`${API_BASE_URL}/chat/reset`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ conversationId: currentConversationId }),
            });

            if (response.ok) {
                // Conversation reset - messages cleared
                return true;
            }
        } catch (err) {
            console.error("Error resetting conversation:", err);
        }
        return false;
    };

    // Auto-set context mode based on location
    useEffect(() => {
        if (currentLocation === 'home') {
            setContextMode('global');
        } else if (currentLocation === 'notes') {
            setContextMode('local');
        } else if (currentLocation === 'tasks') {
            setContextMode('global');
        } else if (currentLocation === 'notebooks') {
            setContextMode('global');
        }
    }, [currentLocation]);

    const value = {
        isChatOpen,
        openChat,
        closeChat,
        toggleChat,
        currentConversationId,
        setCurrentConversationId,
        unreadCount,
        setUnreadCount,
        resetCurrentChat,

        // Context mode and location (contextMode is read-only, auto-set)
        contextMode,
        currentNoteId,
        setCurrentNoteId,
        currentLocation,
        setCurrentLocation,
        isViewingProtectedNote,
        setIsViewingProtectedNote,
    };

    return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};

