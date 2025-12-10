import React, { createContext, useContext, useState } from "react";

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
    };

    return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};
