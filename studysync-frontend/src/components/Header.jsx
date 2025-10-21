// src/components/Header.jsx

import React from 'react';

export default function Header({ title, subtitle }) {
    return (
        <header className="mb-10">
            {/* 1. Increased font size to `text-5xl` for brand prominence. */}
            {/* 2. Added gradient text effect for a modern, professional look. */}
            <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
                {title}
            </h1>
            
            {/* The subtitle that changes based on the page */}
            {subtitle && (
                <p className="text-slate-400 mt-2">{subtitle}</p>
            )}
        </header>
    );
}