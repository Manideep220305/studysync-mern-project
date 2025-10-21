// src/routes/leaderboard.routes.js

import express from 'express';
import { authMiddleware } from '../middleware/auth.middleware.js';
import { getGlobalLeaderboard, getGroupLeaderboard } from '../controllers/leaderboard.controller.js';

const router = express.Router();

// GET /api/leaderboard (for the global leaderboard)
router.get('/', authMiddleware, getGlobalLeaderboard);

// GET /api/leaderboard/group/:groupId (for a group-specific leaderboard)
router.get('/group/:groupId', authMiddleware, getGroupLeaderboard);

export default router;