import React, { useEffect, useRef, useState } from "react";
import ForceGraph2D from "react-force-graph-2d";
import { useNavigate } from "react-router-dom";
import { useNote } from "../Components/NoteContext";
import "./NotesGraph.css";

// Import icons for topics
import { IoIosBriefcase } from "react-icons/io";
import { FaShoppingCart, FaUser, FaPlane, FaHome, FaUtensils, FaHeartbeat, FaLock, FaCircle } from "react-icons/fa";
import { MdAttachMoney, MdSportsEsports } from "react-icons/md";

const NotesGraph = ({ graphData, onRegenerate, isLoading }) => {
    const navigate = useNavigate();
    const { setSelectedNoteId, setSelectedNoteName } = useNote();
    const graphRef = useRef();
    const [dimensions, setDimensions] = useState({ width: 800, height: 600 });

    // Measure container dimensions
    useEffect(() => {
        const updateDimensions = () => {
            const container = document.querySelector('.graph-container');
            if (container) {
                setDimensions({
                    width: container.offsetWidth,
                    height: container.offsetHeight
                });
            }
        };

        updateDimensions();
        window.addEventListener('resize', updateDimensions);
        return () => window.removeEventListener('resize', updateDimensions);
    }, []);

    // Color palette for different topics
    const getTopicColor = (topic) => {
        const colors = {
            "Empty": "#9E9E9E",        // Gray
            "Work": "#8B4513",         // Brown (Saddle Brown)
            "Personal": "#4CAF50",     // Green
            "Finance": "#FF9800",      // Orange
            "Food": "#FF5722",         // Deep Orange
            "Home": "#FFD700",         // Gold/Yellow
            "Travel": "#03A9F4",       // Light Blue
            "Leisure": "#673AB7",      // Purple
            "Health": "#E53935",       // Red
            "Shopping": "#E91E63",     // Pink
            "Protected": "#9E9E9E",    // Gray
            "Ideas": "#00BCD4",        // Cyan
            "Other": "#9E9E9E",
            "Uncategorized": "#757575"
        };
        return colors[topic] || "#9E9E9E";
    };

    // Icon mapping for different topics (React components - for legend)
    const getTopicIcon = (topic) => {
        const icons = {
            "Work": <IoIosBriefcase />,
            "Shopping": <FaShoppingCart />,
            "Personal": <FaUser />,
            "Finance": <MdAttachMoney />,
            "Health": <FaHeartbeat />,
            "Food": <FaUtensils />,
            "Home": <FaHome />,
            "Travel": <FaPlane />,
            "Leisure": <MdSportsEsports />,
            "Protected": <FaLock />,
            "Empty": <FaCircle />,
            "Other": <FaCircle />,
            "Uncategorized": <FaCircle />
        };
        return icons[topic] || <FaCircle />;
    };

    // Emoji mapping for canvas drawing (graph nodes)
    const getTopicEmoji = (topic) => {
        const emojis = {
            "Work": "💼",
            "Shopping": "🛒",
            "Personal": "👤",
            "Finance": "💰",
            "Health": "❤️",
            "Food": "🍽️",
            "Home": "🏠",
            "Travel": "✈️",
            "Leisure": "🎮",
            "Protected": "🔒",
            "Empty": "○",
            "Ideas": "💡",
            "Other": "○",
            "Uncategorized": "○"
        };
        return emojis[topic] || "○";
    };

    const handleNodeClick = (node) => {
        setSelectedNoteId(node.id);
        setSelectedNoteName(node.label);
        navigate("/notes");
    };

    if (!graphData || !graphData.nodes || graphData.nodes.length === 0) {
        return (
            <div className="graph-empty-state">
                <div className="graph-empty-icon">🕸️</div>
                <h3>No Notes to Visualize</h3>
                <p>Create some notes to see them visualized as a semantic network</p>
            </div>
        );
    }

    return (
        <div className="graph-container">
            <div className="graph-controls">
                <button
                    className="refresh-graph-btn"
                    onClick={onRegenerate}
                    disabled={isLoading}
                    title="Regenerate graph with latest notes"
                >
                    🔄 Refresh Graph
                </button>
            </div>

            <ForceGraph2D
                ref={graphRef}
                width={dimensions.width}
                height={dimensions.height}
                graphData={graphData}
                nodeLabel={node => `${node.label}\n${node.topic}${node.subtopic ? ' - ' + node.subtopic : ''}\n\n${node.preview || ''}`}
                nodeCanvasObject={(node, ctx, globalScale) => {
                    const label = node.label;
                    const fontSize = 12 / globalScale;
                    const nodeSize = node.isProtected ? 14 : 12; // Larger nodes to fit icons

                    // Check if dark mode is active
                    const isDarkMode = document.body.classList.contains('dark-mode');

                    // Draw node circle
                    ctx.beginPath();
                    ctx.arc(node.x, node.y, nodeSize, 0, 2 * Math.PI, false);
                    ctx.fillStyle = getTopicColor(node.topic);
                    ctx.fill();

                    // Border color matches background for cleaner look
                    ctx.strokeStyle = node.isProtected ? '#ffc107' : (isDarkMode ? '#1a1a1a' : '#ffffff');
                    ctx.lineWidth = 2.5 / globalScale;
                    ctx.stroke();

                    // Draw topic emoji icon inside the node
                    const emoji = getTopicEmoji(node.topic);
                    ctx.font = `${nodeSize * 1.1}px Sans-Serif`;
                    ctx.textAlign = 'center';
                    ctx.textBaseline = 'middle';
                    ctx.fillText(emoji, node.x, node.y);

                    // Draw label below node
                    ctx.font = `${fontSize}px Sans-Serif`;
                    ctx.textAlign = 'center';
                    ctx.textBaseline = 'middle';
                    ctx.fillStyle = isDarkMode ? '#ffffff' : '#333333';
                    ctx.fillText(label, node.x, node.y + nodeSize + 10 / globalScale);
                }}
                linkColor={link => `rgba(150, 150, 150, ${link.strength || 0.3})`}
                linkWidth={link => (link.strength || 0.3) * 2}
                linkDirectionalParticles={2}
                linkDirectionalParticleWidth={link => (link.strength || 0.3) * 2}
                onNodeClick={handleNodeClick}
                cooldownTicks={100}
                onEngineStop={() => graphRef.current?.zoomToFit(400, 50)}
            />

            <div className="graph-legend">
                <h4>Topics</h4>
                {[...new Set(graphData.nodes.map(n => n.topic))].map(topic => (
                    <div key={topic} className="legend-item">
                        <span
                            className="legend-icon"
                            style={{ color: getTopicColor(topic) }}
                        >
                            {getTopicIcon(topic)}
                        </span>
                        <span>{topic}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default NotesGraph;
