-- =====================================================
-- Add graph_meta_data column to users table
-- This will store the cached graph structure (nodes and links)
-- =====================================================

ALTER TABLE users 
ADD graph_meta_data NVARCHAR(MAX) NULL;

-- Column will store JSON data with this structure:
-- {
--   "nodes": [...],
--   "links": [...],
--   "generated_at": "timestamp",
--   "note_count": number
-- }
