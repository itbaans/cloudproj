const { pool, poolConnect, sql } = require('../db2');
const logger = require('../utils/logger');

async function migrate() {
    try {
        await poolConnect;

        console.log('Starting migration: add_conversation_type...');

        // Add new columns
        await pool.request().query(`
      ALTER TABLE chat_conversations 
      ADD conversation_type NVARCHAR(20) NULL,
          note_id INT NULL
    `);

        console.log('Columns added successfully');

        // Set default type for existing conversations to 'global'
        await pool.request().query(`
      UPDATE chat_conversations 
      SET conversation_type = 'global' 
      WHERE conversation_type IS NULL
    `);

        console.log('Migration completed successfully!');
        process.exit(0);
    } catch (err) {
        console.error('Migration failed:', err);
        process.exit(1);
    }
}

migrate();
