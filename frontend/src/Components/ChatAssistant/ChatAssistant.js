import React, { useState, useEffect, useRef } from "react";
import ChatMessage from "./ChatMessage";
import ConversationList from "./ConversationList";
import { useChat } from "./ChatContext";
import botActions from "./BotActions";
import { API_BASE_URL } from "../../App/config.js";
import "./ChatAssistant.css";

const ChatAssistant = () => {
    const {
        isChatOpen,
        closeChat,
        currentConversationId,
        setCurrentConversationId,
        contextMode,
        setContextMode,
        currentNoteId,
        currentLocation,
        conversations,
        isLoadingConversations,
        selectConversation,
        deleteConversation,
        loadConversations,
    } = useChat();

    const [messages, setMessages] = useState([]);
    const [inputMessage, setInputMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [showConversations, setShowConversations] = useState(false);
    const messagesEndRef = useRef(null);
    const token = localStorage.getItem("token");

    // Auto-scroll to bottom when new messages arrive
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    // Load conversation history if conversationId exists
    useEffect(() => {
        if (isChatOpen && currentConversationId) {
            loadConversationHistory();
        } else if (isChatOpen && !currentConversationId) {
            setMessages([]);
        }
    }, [isChatOpen, currentConversationId]);

    const loadConversationHistory = async () => {
        try {
            const response = await fetch(
                `${API_BASE_URL}/chat/history/${currentConversationId}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (response.ok) {
                const data = await response.json();
                setMessages(data.messages || []);
            }
        } catch (err) {
            console.error("Error loading conversation history:", err);
        }
    };

    const handleSendMessage = async (e) => {
        e.preventDefault();

        if (!inputMessage.trim() || isLoading) return;

        const userMessage = inputMessage.trim();
        setInputMessage("");
        setError(null);

        // Add user message to UI immediately
        const tempUserMessage = {
            role: "user",
            content: userMessage,
            created_at: new Date().toISOString(),
        };
        setMessages((prev) => [...prev, tempUserMessage]);
        setIsLoading(true);

        try {
            const requestBody = {
                conversationId: currentConversationId,
                message: userMessage,
                contextMode: contextMode,
            };

            // Add noteId if in local mode
            if (contextMode === 'local' && currentNoteId) {
                requestBody.noteId = currentNoteId;
            }

            const response = await fetch(`${API_BASE_URL}/chat/message`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(requestBody),
            });

            const data = await response.json();

            if (response.ok) {
                // Update conversation ID if it's a new conversation
                if (!currentConversationId && data.conversationId) {
                    setCurrentConversationId(data.conversationId);
                    loadConversations(); // Refresh conversation list
                }

                // Add assistant response to messages
                const assistantMessage = {
                    role: "assistant",
                    content: data.message,
                    created_at: data.timestamp,
                };
                setMessages((prev) => [...prev, assistantMessage]);

                // Execute bot actions if any
                if (data.actions && data.actions.length > 0) {
                    await botActions.executeActions(data.actions);
                }
            } else {
                setError(data.error || "Failed to send message");
                // Remove the temporary user message on error
                setMessages((prev) => prev.slice(0, -1));
            }
        } catch (err) {
            console.error("Error sending message:", err);
            setError("Network error. Please try again.");
            setMessages((prev) => prev.slice(0, -1));
        } finally {
            setIsLoading(false);
        }
    };

    const handleNewChat = () => {
        setMessages([]);
        setCurrentConversationId(null);
        setError(null);
    };

    const handleSelectConversation = (convId) => {
        selectConversation(convId);
        setShowConversations(false);
    };

    const handleDeleteConversation = async (convId) => {
        await deleteConversation(convId);
    };

    if (!isChatOpen) return null;

    const canToggleContext = currentLocation === 'notes';
    const contextBadge = contextMode === 'local' ? '📝 Local' : '🌐 Global';

    return (
        <div className="chat-assistant-popup">
            <div className="chat-popup-container">
                {/* Conversation List Sidebar (collapsible) */}
                {showConversations && (
                    <ConversationList
                        conversations={conversations}
                        currentConversationId={currentConversationId}
                        onSelectConversation={handleSelectConversation}
                        onDeleteConversation={handleDeleteConversation}
                        onNewConversation={handleNewChat}
                        isLoading={isLoadingConversations}
                    />
                )}

                {/* Main Chat Area */}
                <div className="chat-main-area">
                    {/* Header */}
                    <div className="chat-header">
                        <div className="chat-header-left">
                            <button
                                className="btn-toggle-conversations"
                                onClick={() => setShowConversations(!showConversations)}
                                title="Conversations"
                            >
                                {showConversations ? '✕' : '💬'}
                            </button>
                            <div className="chat-title">
                                <span className="chat-icon">🤖</span>
                                <h3>AI Assistant</h3>
                            </div>
                        </div>
                        <div className="chat-header-right">
                            {canToggleContext && (
                                <div className="context-mode-toggle">
                                    <button
                                        className={`context-btn ${contextMode === 'global' ? 'active' : ''}`}
                                        onClick={() => setContextMode('global')}
                                        title="Global context (all notes)"
                                    >
                                        🌐
                                    </button>
                                    <button
                                        className={`context-btn ${contextMode === 'local' ? 'active' : ''}`}
                                        onClick={() => setContextMode('local')}
                                        title="Local context (current note only)"
                                    >
                                        📝
                                    </button>
                                </div>
                            )}
                            <span className="context-badge">{contextBadge}</span>
                            <button
                                className="btn-new-chat"
                                onClick={handleNewChat}
                                title="New conversation"
                            >
                                ➕
                            </button>
                            <button
                                className="btn-close-chat"
                                onClick={closeChat}
                                title="Close chat"
                            >
                                ✕
                            </button>
                        </div>
                    </div>

                    {/* Messages Area */}
                    <div className="chat-messages">
                        {messages.length === 0 ? (
                            <div className="chat-empty-state">
                                <div className="empty-state-icon">💬</div>
                                <h4>Welcome to your AI Assistant!</h4>
                                <p>
                                    {contextMode === 'local'
                                        ? "I can help you with the current note you're viewing."
                                        : "I can help you with questions about your notes and provide general assistance."}
                                </p>
                                <div className="suggestion-chips">
                                    <button
                                        className="suggestion-chip"
                                        onClick={() => setInputMessage(contextMode === 'local' ? "What is this note about?" : "What notes do I have?")}
                                    >
                                        {contextMode === 'local' ? "What is this note about?" : "What notes do I have?"}
                                    </button>
                                    <button
                                        className="suggestion-chip"
                                        onClick={() => setInputMessage(contextMode === 'local' ? "Summarize this note" : "Summarize my recent notes")}
                                    >
                                        {contextMode === 'local' ? "Summarize this note" : "Summarize my notes"}
                                    </button>
                                    {contextMode === 'local' && (
                                        <button
                                            className="suggestion-chip"
                                            onClick={() => setInputMessage("Highlight the important points")}
                                        >
                                            Highlight key points
                                        </button>
                                    )}
                                </div>
                            </div>
                        ) : (
                            <>
                                {messages.map((msg, index) => (
                                    <ChatMessage
                                        key={index}
                                        message={msg}
                                        isUser={msg.role === "user"}
                                    />
                                ))}
                                {isLoading && (
                                    <div className="typing-indicator">
                                        <div className="typing-dot"></div>
                                        <div className="typing-dot"></div>
                                        <div className="typing-dot"></div>
                                    </div>
                                )}
                            </>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Error Display */}
                    {error && (
                        <div className="chat-error">
                            <span>⚠️ {error}</span>
                        </div>
                    )}

                    {/* Input Area */}
                    <form className="chat-input-container" onSubmit={handleSendMessage}>
                        <input
                            type="text"
                            className="chat-input"
                            placeholder="Ask me anything..."
                            value={inputMessage}
                            onChange={(e) => setInputMessage(e.target.value)}
                            disabled={isLoading}
                        />
                        <button
                            type="submit"
                            className="btn-send"
                            disabled={!inputMessage.trim() || isLoading}
                        >
                            {isLoading ? "⏳" : "🚀"}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ChatAssistant;
