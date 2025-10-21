import express from 'express';
import { authMiddleware } from '../middleware/auth.middleware.js';
import { startSession, stopSession } from '../controllers/session.controller.js';

const router = express.Router();

// @route   POST /api/sessions/start
// @desc    Start a new study session
// @access  Private
router.post('/start', authMiddleware, startSession);

// @route   POST /api/sessions/:sessionId/stop
// @desc    Stop an ongoing study session
// @access  Private
router.post('/:sessionId/stop', authMiddleware, stopSession);

export default router;

