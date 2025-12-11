import React, { useEffect, useRef, useState } from "react";
import ForceGraph2D from "react-force-graph-2d";
import { useNavigate } from "react-router-dom";
import { useNote } from "../Components/NoteContext";
import "./NotesGraph.css";

const NotesGraph = ({ graphData, onRegenerate, isLoading }) => {
    const navigate = useNavigate();
    const { setSelectedNoteId } = useNote();
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
            "Shopping": "#4CAF50",
            "Work": "#2196F3",
            "Personal": "#9C27B0",
            "Finance": "#FF9800",
            "Ideas": "#E91E63",
            "Health": "#00BCD4",
            "Other": "#9E9E9E",
            "Protected": "#9E9E9E",  // ← ADD THIS LINE
            "Uncategorized": "#757575"
        };
        return colors[topic] || "#9E9E9E";
    };

    const handleNodeClick = (node) => {
        setSelectedNoteId(node.id);
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
                    const nodeSize = node.isProtected ? 7 : 5; // Larger for protected

                    // Draw node circle
                    ctx.beginPath();
                    ctx.arc(node.x, node.y, nodeSize, 0, 2 * Math.PI, false);
                    ctx.fillStyle = getTopicColor(node.topic);
                    ctx.fill();
                    ctx.strokeStyle = node.isProtected ? '#ffc107' : '#fff'; // Gold border
                    ctx.lineWidth = node.isProtected ? 2.5 / globalScale : 1.5 / globalScale;
                    ctx.stroke();

                    // Draw lock icon for protected notes
                    if (node.isProtected) {
                        ctx.font = `${fontSize * 1.5}px Sans-Serif`;
                        ctx.fillText('🔒', node.x - fontSize * 0.6, node.y + fontSize * 0.4);
                    }

                    // Draw label
                    ctx.font = `${fontSize}px Sans-Serif`;
                    ctx.textAlign = 'center';
                    ctx.textBaseline = 'middle';
                    ctx.fillStyle = '#333';
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
                            className="legend-color"
                            style={{ backgroundColor: getTopicColor(topic) }}
                        />
                        <span>{topic}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default NotesGraph;
