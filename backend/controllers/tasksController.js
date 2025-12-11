const tasksModel = require("../models/tasksModel");

// Get all tasks for the authenticated user
const getTasks = async (req, res) => {
    try {
        const userId = req.user.userId;
        const tasks = await tasksModel.getAllTasks(userId);
        res.status(200).json({ tasks });
    } catch (error) {
        console.error("Error fetching tasks:", error);
        res.status(500).json({ error: "Failed to fetch tasks" });
    }
};

// Create a new task
const createTask = async (req, res) => {
    try {
        const userId = req.user.userId;
        const { taskText } = req.body;

        if (!taskText || taskText.trim() === "") {
            return res.status(400).json({ error: "Task text is required" });
        }

        const task = await tasksModel.createTask(userId, taskText.trim());
        res.status(201).json({ task });
    } catch (error) {
        console.error("Error creating task:", error);
        res.status(500).json({ error: "Failed to create task" });
    }
};

// Toggle task completion status
const toggleTaskStatus = async (req, res) => {
    try {
        const userId = req.user.userId;
        const { id } = req.params;
        const { isCompleted } = req.body;

        if (typeof isCompleted !== "boolean") {
            return res.status(400).json({ error: "isCompleted must be a boolean" });
        }

        const task = await tasksModel.updateTaskStatus(id, userId, isCompleted);

        if (!task) {
            return res.status(404).json({ error: "Task not found" });
        }

        res.status(200).json({ task });
    } catch (error) {
        console.error("Error updating task:", error);
        res.status(500).json({ error: "Failed to update task" });
    }
};

// Delete a task
const deleteTask = async (req, res) => {
    try {
        const userId = req.user.userId;
        const { id } = req.params;

        const deletedTask = await tasksModel.deleteTask(id, userId);

        if (!deletedTask) {
            return res.status(404).json({ error: "Task not found" });
        }

        res.status(200).json({ message: "Task deleted successfully" });
    } catch (error) {
        console.error("Error deleting task:", error);
        res.status(500).json({ error: "Failed to delete task" });
    }
};

module.exports = {
    getTasks,
    createTask,
    toggleTaskStatus,
    deleteTask,
};
