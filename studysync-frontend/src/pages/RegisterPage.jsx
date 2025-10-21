// src/pages/RegisterPage.jsx

import React, { useState } from 'react';
const API_URL = 'http://localhost:5000';

export default function RegisterPage({ setToken, setPage }) {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleRegister = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const response = await fetch(`${API_URL}/api/auth/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, password }),
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.message || 'Registration failed');
            
            // On successful registration, our backend automatically logs the user in.
            // So we save the token and switch to the dashboard.
            localStorage.setItem('token', data.token);
            setToken(data.token);
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 to-gray-900 text-white p-4 relative overflow-hidden">
            {/* The Aurora background glow effect */}
            <div className="absolute top-1/4 left-1/4 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
            <div className="absolute top-1/2 right-1/4 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
            <div className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-indigo-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>

            <div className="relative z-10 w-full max-w-lg p-10 space-y-8 bg-slate-800 rounded-2xl shadow-2xl border border-slate-700">
                <h1 className="text-4xl font-extrabold text-center text-blue-400">Create Your Account</h1>
                <form onSubmit={handleRegister} className="space-y-6">
                    <div>
                        <label className="block text-base font-medium text-slate-400 mb-1">Name</label>
                        <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full px-5 py-3 text-slate-200 bg-slate-700 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" required />
                    </div>
                    <div>
                        <label className="block text-base font-medium text-slate-400 mb-1">Email</label>
                        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-5 py-3 text-slate-200 bg-slate-700 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" required />
                    </div>
                    <div>
                        <label className="block text-base font-medium text-slate-400 mb-1">Password</label>
                        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full px-5 py-3 text-slate-200 bg-slate-700 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" required />
                    </div>
                    {error && <p className="text-sm text-red-400 text-center">{error}</p>}
                    <button type="submit" className="w-full py-3 font-bold text-lg text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition">Create Account</button>
                </form>
                <p className="text-base text-center text-slate-400">
                    Already have an account?{' '}
                    <button onClick={() => setPage('login')} className="font-bold text-blue-400 hover:underline">Login</button>
                </p>
            </div>
        </div>
    );
}