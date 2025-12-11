-- Create tasks table
CREATE TABLE tasks (
    id INT IDENTITY(1,1) PRIMARY KEY,
    user_id INT NOT NULL,
    task_text NVARCHAR(500) NOT NULL,
    is_completed BIT DEFAULT 0,
    created_at DATETIME2 DEFAULT SYSDATETIME(),
    updated_at DATETIME2 DEFAULT SYSDATETIME(),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Create index for faster lookups by user
CREATE INDEX idx_tasks_user_id ON tasks(user_id);
