import express from 'express';
import { authMiddleware } from '../middleware/auth.middleware.js';
import { createTask, getMyTasks, completeTask, deleteTask } from '../controllers/task.controller.js';

const router = express.Router();

// @route   POST /api/tasks
// @desc    Create a new task
// @access  Private
router.post('/', authMiddleware, createTask);

// @route   GET /api/tasks
// @desc    Get all of a user's tasks
// @access  Private
router.get('/', authMiddleware, getMyTasks);

// @route   PATCH /api/tasks/:taskId/complete
// @desc    Mark a task as completed and award points
// @access  Private
router.patch('/:taskId/complete', authMiddleware, completeTask);

// @route   DELETE /api/tasks/:taskId
// @desc    Delete a task
// @access  Private
router.delete('/:taskId', authMiddleware, deleteTask);


export default router;
