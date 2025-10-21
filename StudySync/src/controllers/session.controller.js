import StudySession from '../models/studySession.model.js';
import User from '../models/user.model.js';
import mongoose from 'mongoose';

/**
 * @desc    Start a new study session
 * @route   POST /api/sessions/start
 * @access  Private
 */
export const startSession = async (req, res) => {
    try {
        const userId = req.user.id;

        // 1. Check if the user already has an active session
        const existingActiveSession = await StudySession.findOne({ user: userId, status: 'active' });
        if (existingActiveSession) {
            return res.status(400).json({ message: 'You already have an active study session.' });
        }

        // 2. Create a new session with the current time as the start time
        const newSession = new StudySession({
            user: userId,
            startTime: new Date(),
        });

        await newSession.save();

        res.status(201).json({ message: 'Study session started!', session: newSession });

    } catch (error) {
        console.error('Start Session Error:', error.message);
        res.status(500).json({ message: 'Server error' });
    }
};


/**
 * @desc    Stop an ongoing study session
 * @route   POST /api/sessions/:sessionId/stop
 * @access  Private
 */
export const stopSession = async (req, res) => {
    try {
        const { sessionId } = req.params;
        const userId = req.user.id;

        // 1. Find the active session for the user
        const session = await StudySession.findOne({ _id: sessionId, user: userId, status: 'active' });
        if (!session) {
            return res.status(404).json({ message: 'No active session found to stop.' });
        }

        // 2. Calculate the duration
        const endTime = new Date();
        const startTime = new Date(session.startTime);
        const durationInMinutes = Math.round((endTime - startTime) / (1000 * 60));

        // 3. Award points (1 point per minute)
        const pointsEarned = durationInMinutes;

        // 4. Update the session document
        session.endTime = endTime;
        session.duration = durationInMinutes;
        session.status = 'completed';
        await session.save();

        // 5. Update the user's total points
        await User.findByIdAndUpdate(userId, { $inc: { points: pointsEarned } });

        res.status(200).json({ 
            message: `Session stopped! You studied for ${durationInMinutes} minutes and earned ${pointsEarned} points.`,
            session: session 
        });

    } catch (error) {
        console.error('Stop Session Error:', error.message);
        res.status(500).json({ message: 'Server error' });
    }
};

