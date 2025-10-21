import express from 'express';
import cors from 'cors';

// --- Import All Your Route Files ---
import authRoutes from './routes/auth.routes.js';
import groupRoutes from './routes/group.routes.js';
import sessionRoutes from './routes/session.routes.js';
import taskRoutes from './routes/task.routes.js';
// 1. IMPORT the new leaderboard routes
import leaderboardRoutes from './routes/leaderboard.routes.js'; 

const app = express();

// --- Core Middleware ---
app.use(cors());
app.use(express.json());

// --- Root Route for API Health Check ---
app.get('/', (req, res) => {
  res.status(200).json({ message: 'Welcome to the StudySync API!' });
});

// --- Use All Your Route Files ---
app.use('/api/auth', authRoutes);
app.use('/api/groups', groupRoutes);
app.use('/api/sessions', sessionRoutes);
app.use('/api/tasks', taskRoutes);
// 2. USE the new leaderboard routes
app.use('/api/leaderboard', leaderboardRoutes); 

export default app;

