// src/controllers/leaderboard.controller.js

import User from '../models/user.model.js';
import Group from '../models/group.model.js';
import mongoose from 'mongoose';

/**
 * @desc    Get the global user leaderboard (Top 100)
 * @route   GET /api/leaderboard
 */
export const getGlobalLeaderboard = async (req, res) => {
    try {
        const leaderboard = await User.find({}).sort({ points: -1 }).limit(100).select('name points');

        const rankedLeaderboard = leaderboard.map((user, index) => ({
            _id: user._id,
            name: user.name,
            points: user.points,
            rank: index + 1,
        }));
        
        res.status(200).json(rankedLeaderboard);
    } catch (error) {
        console.error('Get Global Leaderboard Error:', error.message);
        res.status(500).json({ message: 'Server error' });
    }
};

/**
 * @desc    Get a group-specific leaderboard and the current user's relative rank.
 * @route   GET /api/leaderboard/group/:groupId
 */
export const getGroupLeaderboard = async (req, res) => {
    try {
        const { groupId } = req.params;
        const userId = req.user.id;

        // 1. Find the group and get its list of member IDs.
        const group = await Group.findById(groupId).select('members');
        if (!group) {
            return res.status(404).json({ message: 'Group not found.' });
        }

        // 2. Fetch all users who are members of this group, sorted by points.
        const leaderboard = await User.find({
            '_id': { $in: group.members }
        }).sort({ points: -1 }).select('name points');

        // 3. Manually add ranks and find the current user's stats.
        let currentUserData = null;
        const rankedLeaderboard = leaderboard.map((user, index) => {
            const rank = index + 1;
            if (user._id.toString() === userId) {
                currentUserData = { rank, points: user.points };
            }
            return { _id: user._id, name: user.name, points: user.points, rank };
        });

        // 4. Calculate the points needed to advance.
        let pointsToNext = null;
        let pointsToBeFirst = null;

        if (currentUserData && currentUserData.rank > 1) {
            const playerAbove = rankedLeaderboard[currentUserData.rank - 2];
            pointsToNext = (playerAbove.points - currentUserData.points) + 1;
        }
        if (currentUserData && currentUserData.rank > 1 && rankedLeaderboard.length > 0) {
            const firstPlayer = rankedLeaderboard[0];
            pointsToBeFirst = (firstPlayer.points - currentUserData.points) + 1;
        }

        // 5. Send all the calculated data back to the frontend.
        res.status(200).json({
            leaderboard: rankedLeaderboard,
            currentUserStats: {
                ...currentUserData,
                pointsToNext,
                pointsToBeFirst,
            }
        });

    } catch (error) {
        console.error('Get Group Leaderboard Error:', error.message);
        res.status(500).json({ message: 'Server error' });
    }
};