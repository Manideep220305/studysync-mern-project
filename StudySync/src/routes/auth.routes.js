import express from 'express';
import { registerUser, loginUser, getMe } from '../controllers/auth.controller.js';
import { authMiddleware } from '../middleware/auth.middleware.js';

const router = express.Router();

// @route   POST /api/auth/register
router.post('/register', registerUser);

// @route   POST /api/auth/login
router.post('/login', loginUser);

// @route   GET /api/auth/me
// We point this to a 'getMe' controller function for cleaner code
router.get('/me', authMiddleware, getMe);

export default router;