// src/pages/DashboardPage.jsx

import React, { useState, useEffect, useCallback } from 'react';
import SideNav from '../components/SideNav';
import StatsPanel from '../components/StatsPanel';
import Icon from '../components/Icon';
import GroupView from '../components/GroupView';
import GroupsListView from '../components/GroupsListView';
import StudyTimer from '../components/StudyTimer';
import Header from '../components/Header'; // Assuming Header.jsx exists
import LeaderboardView from '../components/LeaderboardView';
const API_URL = 'http://localhost:5000';

export default function DashboardPage({ token, onLogout }) {
    // --- State ---
    const [user, setUser] = useState(null);
    const [groups, setGroups] = useState([]);
    const [tasks, setTasks] = useState([]);
    const [leaderboard, setLeaderboard] = useState([]);
    const [initialLoading, setInitialLoading] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [activeGroupId, setActiveGroupId] = useState(null);
    const [activeView, setActiveView] = useState('dashboard');
    const [inviteCode, setInviteCode] = useState('');
    const [joinMessage, setJoinMessage] = useState('');
    const [newTaskContent, setNewTaskContent] = useState('');
    const [taskMessage, setTaskMessage] = useState('');
    const [activeSession, setActiveSession] = useState(null);
    const [timerHours, setTimerHours] = useState('00');
    const [timerMinutes, setTimerMinutes] = useState('25');
    const [timerSeconds, setTimerSeconds] = useState('00');
    const [sessionMessage, setSessionMessage] = useState('');

    // --- Data Fetching ---
    const fetchAllData = useCallback(async (isRefresh = false) => { if (!token) return; if (!isRefresh) setInitialLoading(true); try { const [userRes, groupsRes, tasksRes, leaderboardRes] = await Promise.all([ fetch(`${API_URL}/api/auth/me`, { headers: { 'x-auth-token': token } }), fetch(`${API_URL}/api/groups/mygroups`, { headers: { 'x-auth-token': token } }), fetch(`${API_URL}/api/tasks`, { headers: { 'x-auth-token': token } }), fetch(`${API_URL}/api/leaderboard`, { headers: { 'x-auth-token': token } }) ]); if (!userRes.ok || !groupsRes.ok || !tasksRes.ok || !leaderboardRes.ok) throw new Error('Failed to fetch data.'); setUser(await userRes.json()); setGroups(await groupsRes.json()); setTasks(await tasksRes.json()); setLeaderboard(await leaderboardRes.json()); } catch (error) { console.error(error); onLogout(); } finally { setInitialLoading(false); } }, [token, onLogout]);
    useEffect(() => { fetchAllData(false); const storedSession = localStorage.getItem('activeStudySession'); if (storedSession) { const session = JSON.parse(storedSession); const now = new Date().getTime(); const end = new Date(session.endTime).getTime(); const remainingDuration = Math.round((end - now) / 1000); if (remainingDuration > 0) { setActiveSession({...session, duration: remainingDuration}); } else { localStorage.removeItem('activeStudySession'); } } }, [fetchAllData]);

    // --- Handlers ---
    const handleJoinGroup = async (e) => { e.preventDefault(); if (!inviteCode.trim() || isRefreshing) return; setJoinMessage(''); setIsRefreshing(true); try { const res = await fetch(`${API_URL}/api/groups/join`, { method: 'POST', headers: { 'Content-Type': 'application/json', 'x-auth-token': token }, body: JSON.stringify({ inviteCode: inviteCode.trim() }), }); if (!res.ok) throw new Error((await res.json()).message || 'Failed to join group.'); setJoinMessage('Joined group successfully!'); setInviteCode(''); await fetchAllData(true); } catch (error) { setJoinMessage(error.message); } finally { setIsRefreshing(false); } };
    const handleCreateGroup = async (groupName) => { if (!groupName.trim() || isRefreshing) return; setIsRefreshing(true); try { const res = await fetch(`${API_URL}/api/groups`, { method: 'POST', headers: { 'Content-Type': 'application/json', 'x-auth-token': token }, body: JSON.stringify({ name: groupName.trim() }), }); if (!res.ok) throw new Error((await res.json()).message || 'Failed to create group.'); await fetchAllData(true); } catch (error) { console.error(error); /* Set error state */ } finally { setIsRefreshing(false); } };
    const handleDeleteGroup = async (groupIdToDelete) => { if (isRefreshing) return; setIsRefreshing(true); try { const res = await fetch(`${API_URL}/api/groups/${groupIdToDelete}`, { method: 'DELETE', headers: { 'x-auth-token': token }, }); if (!res.ok) throw new Error((await res.json()).message || 'Failed to delete group.'); setActiveGroupId(null); setActiveView('groups'); await fetchAllData(true); } catch (error) { console.error(error); /* Set error state */ } finally { setIsRefreshing(false); } };
    const handleLeaveGroup = async (groupIdToLeave) => { if (isRefreshing) return; setIsRefreshing(true); try { const res = await fetch(`${API_URL}/api/groups/${groupIdToLeave}/leave`, { method: 'PATCH', headers: { 'x-auth-token': token }, }); if (!res.ok) throw new Error((await res.json()).message || 'Failed to leave group.'); setActiveGroupId(null); setActiveView('groups'); await fetchAllData(true); } catch (error) { console.error(error); /* Set error state */ } finally { setIsRefreshing(false); } };
    const handleCreateTask = async (e) => { e.preventDefault(); if (!newTaskContent.trim() || isRefreshing) return; setTaskMessage(''); setIsRefreshing(true); try { const res = await fetch(`${API_URL}/api/tasks`, { method: 'POST', headers: { 'Content-Type': 'application/json', 'x-auth-token': token }, body: JSON.stringify({ content: newTaskContent.trim() }), }); if (!res.ok) throw new Error((await res.json()).message || 'Failed to create task.'); setNewTaskContent(''); await fetchAllData(true); } catch (error) { setTaskMessage(error.message); } finally { setIsRefreshing(false); } };
    const handleCompleteTask = async (taskId) => { if (isRefreshing) return; setTaskMessage(''); setIsRefreshing(true); try { const res = await fetch(`${API_URL}/api/tasks/${taskId}/complete`, { method: 'PATCH', headers: { 'x-auth-token': token }, }); const data = await res.json(); if (!res.ok) throw new Error(data.message || 'Failed to complete task.'); setTaskMessage(data.message); await fetchAllData(true); } catch (error) { setTaskMessage(error.message); } finally { setIsRefreshing(false); } };
    const handleStartSession = async () => { if (isRefreshing || activeSession) return; const hours = parseInt(timerHours, 10) || 0; const minutes = parseInt(timerMinutes, 10) || 0; const seconds = parseInt(timerSeconds, 10) || 0; if (hours < 0 || minutes < 0 || minutes > 59 || seconds < 0 || seconds > 59) { setSessionMessage('Please enter valid numbers (HH >= 0, MM/SS 0-59).'); return; } const totalDurationInSeconds = (hours * 3600) + (minutes * 60) + seconds; if (totalDurationInSeconds <= 0) { setSessionMessage('Duration must be greater than 0 seconds.'); return; } setIsRefreshing(true); setSessionMessage(''); try { const res = await fetch(`${API_URL}/api/sessions/start`, { method: 'POST', headers: { 'Content-Type': 'application/json', 'x-auth-token': token } }); const data = await res.json(); if (!res.ok) throw new Error(data.message || 'Failed to start session.'); const calculatedEndTime = new Date(new Date().getTime() + totalDurationInSeconds * 1000); const sessionData = { _id: data.session._id, endTime: calculatedEndTime.toISOString(), duration: totalDurationInSeconds }; setActiveSession(sessionData); localStorage.setItem('activeStudySession', JSON.stringify(sessionData)); } catch (error) { setSessionMessage(error.message); } finally { setIsRefreshing(false); } };
    const handleStopSession = async () => { if (!activeSession || isRefreshing) return; setIsRefreshing(true); setSessionMessage(''); try { const res = await fetch(`${API_URL}/api/sessions/${activeSession._id}/stop`, { method: 'POST', headers: { 'x-auth-token': token } }); const data = await res.json(); if (!res.ok) throw new Error(data.message || 'Failed to stop session.'); setSessionMessage(data.message); setActiveSession(null); localStorage.removeItem('activeStudySession'); await fetchAllData(true); } catch (error) { setSessionMessage(error.message); } finally { setIsRefreshing(false); } };

    const renderActiveView = () => {
        if (activeGroupId) { return <GroupView groupId={activeGroupId} token={token} user={user} onBack={() => setActiveGroupId(null)} onDeleteGroup={handleDeleteGroup} onLeaveGroup={handleLeaveGroup} />; }
        switch (activeView) {
            case 'groups': return <GroupsListView groups={groups} onViewGroup={setActiveGroupId} onJoinGroup={handleJoinGroup} onCreateGroup={handleCreateGroup} inviteCode={inviteCode} setInviteCode={setInviteCode} joinMessage={joinMessage} isRefreshing={isRefreshing} />;
            case 'leaderboard': return <LeaderboardView groups={groups} token={token} currentUser={user} />;
            case 'dashboard':
            default:
                return (
                    <div>
                        <Header title="StudySync" subtitle={`Welcome back, ${user?.name}.`} />
                        {/* Consistent vertical spacing between sections */}
                        <div className="space-y-8"> 
                            {/* Card structure for Tasks */}
                            <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl shadow-lg overflow-hidden">
                                <div className="p-6 border-b border-slate-700/50">
                                    {/* Bolder header */}
                                    <h2 className="text-xl font-semibold text-white">Your Tasks</h2>
                                </div>
                                <div className="p-6">
                                    <form onSubmit={handleCreateTask} className="flex gap-3 mb-4"><input type="text" value={newTaskContent} onChange={(e) => setNewTaskContent(e.target.value)} placeholder="What's your next objective?" className="flex-grow p-3 bg-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" /><button type="submit" disabled={isRefreshing} className="px-5 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition disabled:bg-slate-500">Add</button></form>
                                    <div className="space-y-3 mt-4">{tasks.filter(t => t.status === 'pending').length > 0 ? tasks.filter(t => t.status === 'pending').map(task => (<div key={task._id} className="flex items-center justify-between p-3 bg-slate-700/50 rounded-md hover:bg-slate-700/80 transition-colors"><p className="text-slate-300">{task.content}</p><button onClick={() => handleCompleteTask(task._id)} disabled={isRefreshing} className="text-xs font-semibold text-green-400 border border-green-400/50 px-3 py-1 rounded-full hover:bg-green-400/20 transition disabled:opacity-50">Mark as Done</button></div>)) : (<p className="text-slate-500 text-center py-4">No pending tasks. Great job!</p>)}</div>{taskMessage && <p className="text-sm text-center mt-3 text-green-400">{taskMessage}</p>}
                                </div>
                            </div>

                            {/* Grid for Groups Summary and Timer */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                {/* Card structure for Groups Summary */}
                                <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl shadow-lg overflow-hidden">
                                    <div className="p-6 border-b border-slate-700/50 flex justify-between items-center">
                                        {/* Bolder header */}
                                        <h2 className="text-xl font-semibold text-white">Your Study Groups</h2>
                                        {/* Smaller, secondary button */}
                                        <button onClick={() => setActiveView('groups')} className="px-4 py-2 text-sm font-semibold text-blue-400 bg-blue-600/20 rounded-lg hover:bg-blue-600/40 transition"> Manage All </button>
                                    </div>
                                    <div className="p-6">
                                        {groups.length > 0 ? (
                                            <div className="grid grid-cols-1 gap-4">
                                                {/* Show only first 2-3 groups as preview */}
                                                {groups.slice(0, 3).map(group => (
                                                    <div key={group._id} onClick={() => setActiveGroupId(group._id)} className="p-4 bg-slate-700/50 rounded-lg hover:bg-slate-700/80 cursor-pointer transition">
                                                        <p className="font-semibold text-slate-200 truncate">{group.name}</p>
                                                        <p className="text-xs text-slate-400 font-mono">Code: {group.inviteCode}</p>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <p className="text-slate-500 text-center py-4">No groups yet.</p>
                                        )}
                                    </div>
                                </div>

                                {/* Card structure for Timer */}
                                <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl shadow-lg overflow-hidden">
                                    <div className="p-6 border-b border-slate-700/50">
                                        {/* Bolder header */}
                                        <h2 className="text-xl font-semibold text-white">{activeSession ? "Focus Session" : "Start Studying"}</h2>
                                    </div>
                                    <div className="p-6">
                                        {activeSession ? (
                                            <StudyTimer initialDuration={activeSession.duration} onStopSession={handleStopSession} isRefreshing={isRefreshing} />
                                        ) : (
                                            <div className="text-center">
                                                <p className="text-slate-400 text-sm mb-4">Set focus duration (HH:MM:SS).</p>
                                                <div className="flex flex-wrap items-center justify-center gap-2 mb-4">
                                                    <input type="number" value={timerHours} onChange={(e) => setTimerHours(e.target.value)} className="w-16 p-2 text-2xl text-center bg-slate-700 rounded-lg font-mono appearance-none" min="0" aria-label="Hours"/>
                                                    <span className="text-2xl font-bold text-slate-500 pb-1">:</span>
                                                    <input type="number" value={timerMinutes} onChange={(e) => setTimerMinutes(e.target.value)} className="w-16 p-2 text-2xl text-center bg-slate-700 rounded-lg font-mono appearance-none" min="0" max="59" aria-label="Minutes"/>
                                                    <span className="text-2xl font-bold text-slate-500 pb-1">:</span>
                                                    <input type="number" value={timerSeconds} onChange={(e) => setTimerSeconds(e.target.value)} className="w-16 p-2 text-2xl text-center bg-slate-700 rounded-lg font-mono appearance-none" min="0" max="59" aria-label="Seconds"/>
                                                </div>
                                                <button onClick={handleStartSession} disabled={isRefreshing} className="w-full py-3 font-bold text-lg text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition disabled:bg-slate-500">Start Timer</button>
                                                {sessionMessage && <p className={`text-sm text-center mt-3 ${sessionMessage.includes('earned') ? 'text-green-400' : 'text-red-400'}`}>{sessionMessage}</p>}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                );
        }
    };

    if (initialLoading) { return <div className="min-h-screen flex items-center justify-center bg-slate-900 text-white">Loading...</div>; }

    return (
        <div className="min-h-screen bg-slate-900 text-white relative">
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-slate-900 to-gray-900 z-0"></div>
            <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-500/50 rounded-full mix-blend-lighten filter blur-3xl opacity-40" style={{ animation: 'aurora 15s ease-in-out infinite' }}></div>
            <div className="absolute bottom-0 -right-4 w-72 h-72 bg-blue-500/50 rounded-full mix-blend-lighten filter blur-3xl opacity-40" style={{ animation: 'aurora-reverse 20s ease-in-out infinite' }}></div>
            <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-green-500/30 rounded-full mix-blend-lighten filter blur-3xl opacity-30" style={{ animation: 'aurora 18s ease-in-out infinite' }}></div>
            <div className="relative z-10 flex">
                <SideNav activeView={activeView} setActiveView={setActiveView} />
                <div className="flex-1 flex min-w-0">
                    <main className="flex-1 p-8">
                        {renderActiveView()}
                    </main>
                    <StatsPanel user={user} leaderboard={leaderboard} onLogout={onLogout} />
                </div>
            </div>
        </div>
    );
}