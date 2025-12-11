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

    // New state for context modes and location
    const [contextMode, setContextMode] = useState('global'); // 'global' or 'local'
    const [currentNoteId, setCurrentNoteId] = useState(null);
    const [currentLocation, setCurrentLocation] = useState('home'); // 'home' or 'notes'
    const [isViewingProtectedNote, setIsViewingProtectedNote] = useState(false);

    // Conversation list state
    const [conversations, setConversations] = useState([]);
    const [isLoadingConversations, setIsLoadingConversations] = useState(false);

    const openChat = () => {
        setIsChatOpen(true);
        setUnreadCount(0);
        loadConversations(); // Load conversations when opening chat
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

    // Load all conversations for the user
    const loadConversations = async () => {
        const token = localStorage.getItem("token");
        if (!token) return;

        setIsLoadingConversations(true);
        try {
            const response = await fetch(`${API_BASE_URL}/chat/conversations`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.ok) {
                const data = await response.json();
                setConversations(data.conversations || []);
            }
        } catch (err) {
            console.error("Error loading conversations:", err);
        } finally {
            setIsLoadingConversations(false);
        }
    };

    // Select a specific conversation
    const selectConversation = (conversationId) => {
        setCurrentConversationId(conversationId);
    };

    // Delete a conversation
    const deleteConversation = async (conversationId) => {
        const token = localStorage.getItem("token");
        if (!token) return false;

        try {
            const response = await fetch(
                `${API_BASE_URL}/chat/conversation/${conversationId}`,
                {
                    method: "DELETE",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (response.ok) {
                // Remove from local state
                setConversations(prev => prev.filter(c => c.id !== conversationId));

                // If the deleted conversation was active, start a new one
                if (currentConversationId === conversationId) {
                    setCurrentConversationId(null);
                }

                return true;
            }
        } catch (err) {
            console.error("Error deleting conversation:", err);
        }
        return false;
    };

    // Reset context mode to global when location changes to home
    useEffect(() => {
        if (currentLocation === 'home') {
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
        startNewConversation,

        // Context mode and location
        contextMode,
        setContextMode,
        currentNoteId,
        setCurrentNoteId,
        currentLocation,
        setCurrentLocation,
        isViewingProtectedNote,
        setIsViewingProtectedNote,

        // Conversations management
        conversations,
        isLoadingConversations,
        loadConversations,
        selectConversation,
        deleteConversation,
    };

    return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};

