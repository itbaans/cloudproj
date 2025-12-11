const { sql, pool, poolConnect } = require("../db2");

async function createTasksTable() {
    try {
        await poolConnect;

        console.log("Creating tasks table...");

        await pool.request().query(`
      CREATE TABLE tasks (
        id INT IDENTITY(1,1) PRIMARY KEY,
        user_id INT NOT NULL,
        task_text NVARCHAR(500) NOT NULL,
        is_completed BIT DEFAULT 0,
        created_at DATETIME2 DEFAULT SYSDATETIME(),
        updated_at DATETIME2 DEFAULT SYSDATETIME(),
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      );
    `);

        console.log("Tasks table created successfully");

        await pool.request().query(`
      CREATE INDEX idx_tasks_user_id ON tasks(user_id);
    `);

        console.log("Tasks table index created successfully");

    } catch (error) {
        if (error.message.includes("There is already an object named 'tasks'")) {
            console.log("Tasks table already exists, skipping creation");
        } else {
            console.error("Error creating tasks table:", error.message);
            throw error;
        }
    }
}

// Run migration if executed directly
if (require.main === module) {
    createTasksTable()
        .then(() => {
            console.log("Migration completed");
            process.exit(0);
        })
        .catch((error) => {
            console.error("Migration failed:", error);
            process.exit(1);
        });
}

module.exports = createTasksTable;
