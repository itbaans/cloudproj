const { sql, pool, poolConnect } = require("../db2");

// Get all tasks for a user
const getAllTasks = async (userId) => {
    await poolConnect;
    const result = await pool.request()
        .input("userId", sql.Int, userId)
        .query("SELECT * FROM tasks WHERE user_id = @userId ORDER BY created_at DESC");
    return result.recordset;
};

// Create a new task
const createTask = async (userId, taskText) => {
    await poolConnect;
    const result = await pool.request()
        .input("userId", sql.Int, userId)
        .input("taskText", sql.NVarChar(500), taskText)
        .query(`
      INSERT INTO tasks (user_id, task_text)
      OUTPUT inserted.*
      VALUES (@userId, @taskText)
    `);
    return result.recordset[0];
};

// Update task completion status
const updateTaskStatus = async (taskId, userId, isCompleted) => {
    await poolConnect;
    const result = await pool.request()
        .input("taskId", sql.Int, taskId)
        .input("userId", sql.Int, userId)
        .input("isCompleted", sql.Bit, isCompleted ? 1 : 0)
        .query(`
      UPDATE tasks
      SET is_completed = @isCompleted, updated_at = SYSDATETIME()
      OUTPUT inserted.*
      WHERE id = @taskId AND user_id = @userId
    `);
    return result.recordset[0];
};

// Delete a task
const deleteTask = async (taskId, userId) => {
    await poolConnect;
    const result = await pool.request()
        .input("taskId", sql.Int, taskId)
        .input("userId", sql.Int, userId)
        .query(`
      DELETE FROM tasks
      OUTPUT deleted.*
      WHERE id = @taskId AND user_id = @userId
    `);
    return result.recordset[0];
};

// Delete all tasks for a user
const deleteAllTasks = async (userId) => {
    await poolConnect;
    const result = await pool.request()
        .input("userId", sql.Int, userId)
        .query("DELETE FROM tasks WHERE user_id = @userId");
    return result.rowsAffected[0];
};

module.exports = {
    getAllTasks,
    createTask,
    updateTaskStatus,
    deleteTask,
    deleteAllTasks,
};

