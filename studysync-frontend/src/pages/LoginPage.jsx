// src/pages/LoginPage.jsx

import React, { useState } from 'react';
const API_URL = 'http://localhost:5000';

export default function LoginPage({ setToken, setPage }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Login failed');
      
      // If successful, save the token and update the state in App.jsx
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
          <h1 className="text-4xl font-extrabold text-center text-blue-400">StudySync</h1>
          <h2 className="text-2xl font-semibold text-center text-slate-300">Welcome Back!</h2>
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-base font-medium text-slate-400 mb-1">Email</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-5 py-3 text-slate-200 bg-slate-700 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" required />
            </div>
            <div>
              <label className="block text-base font-medium text-slate-400 mb-1">Password</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full px-5 py-3 text-slate-200 bg-slate-700 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" required />
            </div>
            {error && <p className="text-sm text-red-400 text-center">{error}</p>}
            <button type="submit" className="w-full py-3 font-bold text-lg text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition">Login</button>
          </form>
          <p className="text-base text-center text-slate-400">
            Don't have an account?{' '}
            <button onClick={() => setPage('register')} className="font-bold text-blue-400 hover:underline">Register</button>
          </p>
        </div>
    </div>
  );
}