import React from "react";
import "./ConversationList.css";

const ConversationList = ({
    conversations,
    currentConversationId,
    onSelectConversation,
    onDeleteConversation,
    onNewConversation,
    isLoading
}) => {
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const diff = now - date;
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));

        if (days === 0) {
            return "Today";
        } else if (days === 1) {
            return "Yesterday";
        } else if (days < 7) {
            return `${days} days ago`;
        } else {
            return date.toLocaleDateString();
        }
    };

    return (
        <div className="conversation-list">
            <div className="conversation-list-header">
                <h4>Conversations</h4>
                <button
                    className="btn-new-conv"
                    onClick={onNewConversation}
                    title="New conversation"
                >
                    ➕
                </button>
            </div>

            <div className="conversation-items">
                {isLoading ? (
                    <div className="conversation-loading">Loading...</div>
                ) : conversations.length === 0 ? (
                    <div className="conversation-empty">No conversations yet</div>
                ) : (
                    conversations.map((conv) => (
                        <div
                            key={conv.id}
                            className={`conversation-item ${currentConversationId === conv.id ? 'active' : ''}`}
                            onClick={() => onSelectConversation(conv.id)}
                        >
                            <div className="conversation-item-content">
                                <div className="conversation-title">
                                    {conv.title || "New Conversation"}
                                </div>
                                <div className="conversation-date">
                                    {formatDate(conv.updated_at)}
                                </div>
                            </div>
                            <button
                                className="btn-delete-conv"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    if (window.confirm("Delete this conversation?")) {
                                        onDeleteConversation(conv.id);
                                    }
                                }}
                                title="Delete conversation"
                            >
                                🗑️
                            </button>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default ConversationList;
