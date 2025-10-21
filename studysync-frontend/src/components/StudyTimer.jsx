// src/components/StudyTimer.jsx

import React, { useState, useEffect } from 'react';

export default function StudyTimer({ initialDuration, onStopSession, isRefreshing }) {
    const [timeRemaining, setTimeRemaining] = useState(initialDuration);
    const [isPaused, setIsPaused] = useState(false);

    useEffect(() => {
        if (timeRemaining <= 0) { if (timeRemaining === 0 && !isRefreshing) { onStopSession(); } return; }
        const timerInterval = setInterval(() => { if (!isPaused) { setTimeRemaining(prevTime => prevTime - 1); } }, 1000);
        return () => clearInterval(timerInterval);
    }, [timeRemaining, isPaused, onStopSession, isRefreshing]);

    const formatTime = (totalSeconds) => {
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;
        return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    };

    return (
        // Added overflow-hidden to the parent card
        <div className="bg-slate-800/50 border border-blue-500/50 rounded-xl p-6 text-center backdrop-blur-sm shadow-lg overflow-hidden">
            <h2 className="text-xl font-semibold mb-2 text-blue-300">Focus Session Active</h2>
            
            {/* --- FIX: Monospace font for timer digits --- */}
            <p className="text-5xl font-bold text-blue-400 font-mono tracking-tighter my-2">
                {formatTime(timeRemaining)}
            </p>

            <div className="flex gap-4 mt-4">
                {isPaused ? (
                    // --- FIX: Resume button (Green, filled) ---
                    <button onClick={() => setIsPaused(false)} className="w-full py-2 font-semibold text-sm text-white bg-green-600 rounded-lg hover:bg-green-700 transition"> Resume </button>
                ) : (
                    // --- FIX: Pause button (Blue, outline style) ---
                    <button onClick={() => setIsPaused(true)} className="w-full py-2 font-semibold text-sm text-blue-400 bg-transparent border-2 border-blue-500 rounded-lg hover:bg-blue-500/20 transition"> Pause </button>
                )}
                {/* --- FIX: Stop button (Red, filled) --- */}
                <button onClick={onStopSession} disabled={isRefreshing} className="w-full py-2 font-semibold text-sm text-white bg-red-600 rounded-lg hover:bg-red-700 transition disabled:bg-slate-500"> {isRefreshing ? 'Saving...' : 'Stop'} </button>
            </div>
        </div>
    );
}