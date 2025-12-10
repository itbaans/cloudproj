import React, { useState, useEffect, useRef } from "react";
import ChatMessage from "./ChatMessage";
import { useChat } from "./ChatContext";
import { API_BASE_URL } from "../../App/config.js";
import "./ChatAssistant.css";

const ChatAssistant = () => {
    const {
        isChatOpen,
        closeChat,
        currentConversationId,
        setCurrentConversationId
    } = useChat();

    const [messages, setMessages] = useState([]);
    const [inputMessage, setInputMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
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
            const response = await fetch(`${API_BASE_URL}/chat/message`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    conversationId: currentConversationId,
                    message: userMessage,
                }),
            });

            const data = await response.json();

            if (response.ok) {
                // Update conversation ID if it's a new conversation
                if (!currentConversationId && data.conversationId) {
                    setCurrentConversationId(data.conversationId);
                }

                // Add assistant response to messages
                const assistantMessage = {
                    role: "assistant",
                    content: data.message,
                    created_at: data.timestamp,
                };
                setMessages((prev) => [...prev, assistantMessage]);
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

    if (!isChatOpen) return null;

    return (
        <div className="chat-assistant-overlay">
            <div className="chat-assistant-container">
                {/* Header */}
                <div className="chat-header">
                    <div className="chat-header-content">
                        <div className="chat-title">
                            <span className="chat-icon">🤖</span>
                            <h3>AI Assistant</h3>
                        </div>
                        <div className="chat-header-actions">
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
                    {currentConversationId && (
                        <div className="chat-subtitle">
                            Conversation ID: {currentConversationId}
                        </div>
                    )}
                </div>

                {/* Messages Area */}
                <div className="chat-messages">
                    {messages.length === 0 ? (
                        <div className="chat-empty-state">
                            <div className="empty-state-icon">💬</div>
                            <h4>Welcome to your AI Assistant!</h4>
                            <p>I can help you with questions about your notes and provide general assistance.</p>
                            <div className="suggestion-chips">
                                <button
                                    className="suggestion-chip"
                                    onClick={() => setInputMessage("What notes do I have?")}
                                >
                                    What notes do I have?
                                </button>
                                <button
                                    className="suggestion-chip"
                                    onClick={() => setInputMessage("Summarize my recent notes")}
                                >
                                    Summarize my notes
                                </button>
                                <button
                                    className="suggestion-chip"
                                    onClick={() => setInputMessage("Help me organize my ideas")}
                                >
                                    Help me organize
                                </button>
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
    );
};

export default ChatAssistant;
