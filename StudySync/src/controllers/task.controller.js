import Task from '../models/task.model.js';
import User from '../models/user.model.js';

const POINTS_PER_TASK = 10; // We define the points for a task here

/**
 * @desc    Create a new task
 * @route   POST /api/tasks
 */
export const createTask = async (req, res) => {
    try {
        const { content } = req.body;
        const userId = req.user.id;

        if (!content) {
            return res.status(400).json({ message: 'Task content cannot be empty.' });
        }

        const newTask = new Task({
            user: userId,
            content: content,
        });

        await newTask.save();
        res.status(201).json({ message: 'Task created successfully!', task: newTask });

    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

/**
 * @desc    Get all of a user's tasks
 * @route   GET /api/tasks
 */
export const getMyTasks = async (req, res) => {
    try {
        const userId = req.user.id;
        const tasks = await Task.find({ user: userId }).sort({ createdAt: -1 }); // Newest first
        res.status(200).json(tasks);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

/**
 * @desc    Mark a task as completed
 * @route   PATCH /api/tasks/:taskId/complete
 */
export const completeTask = async (req, res) => {
    try {
        const { taskId } = req.params;
        const userId = req.user.id;

        // Find the task to make sure it exists and belongs to the user
        const task = await Task.findOne({ _id: taskId, user: userId });
        if (!task) {
            return res.status(404).json({ message: 'Task not found.' });
        }

        // Check if task is already completed to prevent earning points twice
        if (task.status === 'completed') {
            return res.status(400).json({ message: 'Task is already completed.' });
        }

        // Update the task's status
        task.status = 'completed';
        await task.save();

        // Award points to the user
        await User.findByIdAndUpdate(userId, { $inc: { points: POINTS_PER_TASK } });

        res.status(200).json({
            message: `Task completed! You earned ${POINTS_PER_TASK} points.`,
            task: task
        });

    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

/**
 * @desc    Delete a task
 * @route   DELETE /api/tasks/:taskId
 */
export const deleteTask = async (req, res) => {
    try {
        const { taskId } = req.params;
        const userId = req.user.id;

        const result = await Task.findOneAndDelete({ _id: taskId, user: userId });

        if (!result) {
            return res.status(404).json({ message: 'Task not found or you are not authorized to delete it.' });
        }

        res.status(200).json({ message: 'Task deleted successfully.' });

    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};
