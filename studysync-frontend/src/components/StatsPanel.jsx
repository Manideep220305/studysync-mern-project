// src/components/StatsPanel.jsx

import React from 'react';
import Icon from './Icon';

export default function StatsPanel({ user, leaderboard, onLogout }) {
    const dailyGoal = 100; // Assuming 100 points is the goal
    const progress = user ? Math.min(Math.round((user.points / dailyGoal) * 100), 100) : 0;
    const circumference = 2 * Math.PI * 70;
    const strokeDashoffset = circumference - (progress / 100) * circumference;
    const topThree = leaderboard ? leaderboard.slice(0, 3) : [];

    return (
        <aside className="w-80 bg-slate-900/30 border-l border-slate-700/50 p-6 flex flex-col z-20">
            {/* --- FIX: Bolder Header --- */}
            <h2 className="text-xl font-semibold text-white">Your Stats</h2>
            
            <div className="mt-8 text-center">
                <p className="text-slate-400 text-sm font-medium">TOTAL POINTS</p>
                <p className="text-6xl font-bold text-blue-400 tracking-tighter">{user ? user.points : 0}</p>
            </div>
            
            <div className="mt-10 text-center">
                 {/* --- FIX: Bolder Header --- */}
                <h3 className="text-lg font-semibold text-white mb-4">Daily Goal</h3>
                <div className="relative inline-flex justify-center items-center">
                    <svg className="w-40 h-40 transform -rotate-90">
                        <circle cx="80" cy="80" r="70" stroke="currentColor" strokeWidth="16" className="text-slate-700" fill="transparent" />
                        <circle cx="80" cy="80" r="70" stroke="currentColor" strokeWidth="16" fill="transparent" strokeDasharray={circumference} strokeDashoffset={strokeDashoffset} className="text-blue-500 transition-all duration-1000" strokeLinecap="round" />
                    </svg>
                    <span className="absolute text-3xl font-bold text-slate-200">{`${progress}%`}</span>
                </div>
                 {/* --- FIX: Added context label --- */}
                 <p className="text-xs text-slate-500 mt-2">({user?.points || 0} / {dailyGoal} points earned today)</p>
            </div>

            <div className="mt-10 flex-grow">
                 {/* --- FIX: Bolder Header --- */}
                <h3 className="text-lg font-semibold text-white mb-3">Top 3 Players</h3>
                <ul className="space-y-3">
                    {topThree.map((player, index) => (
                        <li key={player._id} className="flex items-center justify-between p-2 bg-slate-800/50 rounded-md">
                            <div className="flex items-center gap-3">
                                <span className={`font-bold w-6 text-center ${index === 0 ? 'text-yellow-400' : index === 1 ? 'text-slate-300' : 'text-yellow-600'}`}>#{player.rank}</span>
                                <span className="text-slate-300">{player.name}</span>
                            </div>
                            <span className="font-semibold text-blue-400">{player.points} pts</span>
                        </li>
                    ))}
                     {topThree.length === 0 && (
                        <p className="text-slate-500 text-center py-4">Leaderboard data unavailable.</p>
                     )}
                </ul>
            </div>
            
            <button onClick={onLogout} className="w-full mt-10 px-4 py-2 bg-red-600/30 border border-red-500/50 text-red-300 rounded-md hover:bg-red-600/50 transition text-sm font-semibold">
                Logout
            </button>
        </aside>
    );
}