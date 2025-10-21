// src/components/SideNav.jsx

import React from 'react';

// We are no longer using the Icon.jsx component or lucide-react.
// The SVGs are defined directly here for speed and reliability.

const ICONS = {
    dashboard: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect width="7" height="9" x="3" y="3" rx="1" />
            <rect width="7" height="5" x="14" y="3" rx="1" />
            <rect width="7" height="9" x="14" y="12" rx="1" />
            <rect width="7" height="5" x="3" y="16" rx="1" />
        </svg>
    ),
    groups: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
    ),
    leaderboard: (
         <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
            <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
            <path d="M4 22h16" />
            <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
            <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
            <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
        </svg>
    )
};


export default function SideNav({ activeView, setActiveView }) {
    
    const NavButton = ({ viewName, label, icon }) => {
        const isActive = activeView === viewName;
        return (
            <button 
                onClick={() => setActiveView(viewName)} 
                title={label}
                className={`w-full flex items-center justify-center p-3 rounded-lg relative group transition-colors ${
                    isActive 
                    ? 'bg-blue-600 text-white' 
                    : 'text-slate-400 hover:bg-slate-700'
                }`}
            >
                {icon}
                <span className="absolute left-full ml-4 px-2 py-1 bg-slate-900 text-white text-sm rounded-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                    {label}
                </span>
            </button>
        );
    };

    return (
        <nav className="sticky top-0 h-screen w-20 bg-slate-800/50 border-r border-slate-700/50 flex flex-col items-center py-8 space-y-8 z-30">
            <div className="text-blue-400 font-bold text-2xl">S</div>
            <div className="flex flex-col space-y-4 w-full px-4">
                <NavButton viewName="dashboard" label="Dashboard" icon={ICONS.dashboard} />
                <NavButton viewName="groups" label="Groups" icon={ICONS.groups} />
                <NavButton viewName="leaderboard" label="Leaderboard" icon={ICONS.leaderboard} />
            </div>
        </nav>
    );
}