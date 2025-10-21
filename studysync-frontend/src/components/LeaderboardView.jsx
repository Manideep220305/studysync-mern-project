// src/components/LeaderboardView.jsx

import React, { useState, useEffect, useCallback } from 'react';
import Icon from './Icon';
const API_URL = 'http://localhost:5000';

export default function LeaderboardView({ groups, token, currentUser }) {
    const [selectedGroupId, setSelectedGroupId] = useState('');
    const [leaderboardData, setLeaderboardData] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const fetchLeaderboard = useCallback(async (groupId) => {
        if (!groupId) return;
        setIsLoading(true);
        setError('');
        setLeaderboardData(null);
        try {
            const res = await fetch(`${API_URL}/api/leaderboard/group/${groupId}`, {
                headers: { 'x-auth-token': token },
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || 'Failed to fetch leaderboard');
            setLeaderboardData(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    }, [token]);
    
    // Auto-fetch leaderboard for the first group in the list on component mount
    useEffect(() => {
        if (groups && groups.length > 0) {
            const firstGroupId = groups[0]._id;
            setSelectedGroupId(firstGroupId);
            fetchLeaderboard(firstGroupId);
        }
    }, [groups, fetchLeaderboard]);


    const handleGroupChange = (e) => {
        const newGroupId = e.target.value;
        setSelectedGroupId(newGroupId);
        fetchLeaderboard(newGroupId);
    };

    const stats = leaderboardData?.currentUserStats;

    return (
        <div>
            <header className="mb-10">
                <h1 className="text-4xl font-extrabold text-white">Leaderboard</h1>
                <p className="text-slate-400 mt-1">See how you rank against your peers.</p>
            </header>
            
            <div className="mb-8">
                <label htmlFor="group-select" className="block text-sm font-medium text-slate-400 mb-2">Select a Group Leaderboard:</label>
                <select 
                    id="group-select"
                    value={selectedGroupId}
                    onChange={handleGroupChange}
                    className="w-full max-w-sm p-3 bg-slate-700 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    {groups.map(group => (
                        <option key={group._id} value={group._id}>{group.name}</option>
                    ))}
                </select>
            </div>

            {isLoading && <p className="text-center text-slate-400">Loading leaderboard...</p>}
            {error && <p className="text-center text-red-400">{error}</p>}

            {leaderboardData && (
                <div className="space-y-8">
                    {/* Current User's Stats Card */}
                    {stats && stats.rank !== -1 && (
                        <div>
                             <h2 className="text-2xl font-semibold mb-4">Your Rank in this Group</h2>
                             <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="bg-slate-800/50 p-6 rounded-lg text-center">
                                    <p className="text-slate-400 text-sm">Your Rank</p>
                                    <p className="text-4xl font-bold text-blue-400">#{stats.rank}</p>
                                </div>
                                <div className="bg-slate-800/50 p-6 rounded-lg text-center">
                                    <p className="text-slate-400 text-sm">Points to Next Rank</p>
                                    <p className="text-4xl font-bold text-green-400">{stats.pointsToNext ?? 'N/A'}</p>
                                </div>
                                 <div className="bg-slate-800/50 p-6 rounded-lg text-center">
                                    <p className="text-slate-400 text-sm">Points to Be #1</p>
                                    <p className="text-4xl font-bold text-yellow-400">{stats.pointsToBeFirst ?? 'N/A'}</p>
                                </div>
                             </div>
                        </div>
                    )}

                    {/* Full Leaderboard List */}
                    <div>
                        <h2 className="text-2xl font-semibold mb-4">Full Rankings</h2>
                        <ul className="space-y-3">
                            {leaderboardData.leaderboard.map((player, index) => (
                                <li key={player._id} className={`flex items-center justify-between p-4 rounded-lg ${player._id === currentUser._id ? 'bg-blue-600/30 border border-blue-500' : 'bg-slate-800/50'}`}>
                                    <div className="flex items-center gap-4">
                                        <span className={`font-bold text-lg w-8 text-center ${player.rank === 1 ? 'text-yellow-400' : player.rank === 2 ? 'text-slate-300' : player.rank === 3 ? 'text-yellow-600' : 'text-slate-500'}`}>
                                            #{player.rank}
                                        </span>
                                        <span className="font-semibold text-slate-200">{player.name} {player._id === currentUser._id && '(You)'}</span>
                                    </div>
                                    <span className="font-bold text-blue-400">{player.points} pts</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            )}
        </div>
    );
}