-- Migration: Add profile_picture column to users table
-- Run this SQL in your Azure SQL database

-- Check if column exists before adding
IF NOT EXISTS (
    SELECT * FROM INFORMATION_SCHEMA.COLUMNS 
    WHERE TABLE_NAME = 'users' AND COLUMN_NAME = 'profile_picture'
)
BEGIN
    ALTER TABLE users ADD profile_picture NVARCHAR(MAX) NULL;
    PRINT 'Column profile_picture added successfully';
END
ELSE
BEGIN
    PRINT 'Column profile_picture already exists';
END
