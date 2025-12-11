-- Add new columns to chat_conversations table
ALTER TABLE chat_conversations 
ADD conversation_type NVARCHAR(20) NULL,
    note_id INT NULL;

-- Set default type for existing conversations to 'global'
UPDATE chat_conversations 
SET conversation_type = 'global' 
WHERE conversation_type IS NULL;
