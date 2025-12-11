-- =====================================================
-- Add protection columns to notes table
-- =====================================================

ALTER TABLE notes 
ADD is_protected BIT DEFAULT 0,
    encryption_iv NVARCHAR(64) NULL;

-- Create index for filtering protected notes
CREATE INDEX idx_notes_protected ON notes(is_protected);

-- Columns explanation:
-- is_protected: Boolean flag indicating if note content is encrypted
-- encryption_iv: Initialization vector for AES encryption (unique per note)
