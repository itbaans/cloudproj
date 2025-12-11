const { pool, poolConnect } = require('../db2');

async function createNotebooksTable() {
    try {
        await poolConnect;

        console.log('Creating notebooks table...');

        // Create notebooks table
        await pool.request().query(`
      CREATE TABLE notebooks (
        id INT IDENTITY(1,1) PRIMARY KEY,
        user_id INT NOT NULL,
        notebook_name NVARCHAR(255) NOT NULL DEFAULT 'New Notebook',
        created_at DATETIME2 DEFAULT SYSDATETIME(),
        updated_at DATETIME2 DEFAULT SYSDATETIME(),
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      );
    `);
        console.log('Notebooks table created successfully');

        // Create index for user lookups
        await pool.request().query(`
      CREATE INDEX idx_notebooks_user_id ON notebooks(user_id);
    `);
        console.log('Notebooks index created');

        // Add notebook_id to notes table
        await pool.request().query(`
      ALTER TABLE notes ADD notebook_id INT NULL;
    `);
        console.log('Added notebook_id column to notes table');

        // Add foreign key constraint
        await pool.request().query(`
      ALTER TABLE notes ADD CONSTRAINT FK_notes_notebook 
        FOREIGN KEY (notebook_id) REFERENCES notebooks(id) ON DELETE SET NULL;
    `);
        console.log('Added foreign key constraint');

        // Create index on notebook_id
        await pool.request().query(`
      CREATE INDEX idx_notes_notebook_id ON notes(notebook_id);
    `);
        console.log('Created index on notes.notebook_id');

        // Create default "Uncategorized" notebook for each existing user with notes
        await pool.request().query(`
      INSERT INTO notebooks (user_id, notebook_name)
      SELECT DISTINCT user_id, 'Uncategorized'
      FROM notes
      WHERE user_id IS NOT NULL;
    `);
        console.log('Created default Uncategorized notebooks for existing users');

        // Assign existing notes to their user's Uncategorized notebook
        await pool.request().query(`
      UPDATE notes
      SET notebook_id = (
        SELECT id FROM notebooks 
        WHERE notebooks.user_id = notes.user_id 
        AND notebooks.notebook_name = 'Uncategorized'
      )
      WHERE notebook_id IS NULL;
    `);
        console.log('Assigned existing notes to Uncategorized notebooks');

        console.log('Migration completed successfully!');

    } catch (error) {
        if (error.message.includes("There is already an object named 'notebooks'")) {
            console.log('Notebooks table already exists, skipping creation');
        } else if (error.message.includes("Column names in each table must be unique")) {
            console.log('notebook_id column already exists in notes table');
        } else {
            console.error('Error in migration:', error.message);
            throw error;
        }
    }
}

// Run migration if executed directly
if (require.main === module) {
    createNotebooksTable()
        .then(() => {
            console.log('Migration completed');
            process.exit(0);
        })
        .catch((error) => {
            console.error('Migration failed:', error);
            process.exit(1);
        });
}

module.exports = createNotebooksTable;
