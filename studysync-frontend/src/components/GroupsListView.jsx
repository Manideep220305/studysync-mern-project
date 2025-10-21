// src/components/GroupsListView.jsx
import React, { useState } from 'react';
import Icon from './Icon';

export default function GroupsListView({ groups, onViewGroup, onJoinGroup, onCreateGroup, inviteCode, setInviteCode, joinMessage, isRefreshing }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newGroupName, setNewGroupName] = useState('');
    const handleCreateGroupSubmit = (e) => { e.preventDefault(); onCreateGroup(newGroupName); setIsModalOpen(false); setNewGroupName(''); };

    return (
        <div>
            {isModalOpen && ( <div className="fixed inset-0 bg-black/60 z-40 flex items-center justify-center backdrop-blur-sm"><div className="bg-slate-800 p-8 rounded-xl shadow-2xl w-full max-w-md border border-slate-700"><h2 className="text-2xl font-bold text-white mb-6">Create a New Study Group</h2><form onSubmit={handleCreateGroupSubmit}><input type="text" placeholder="Enter group name..." value={newGroupName} onChange={(e) => setNewGroupName(e.target.value)} className="w-full px-4 py-3 bg-slate-700 text-white rounded-lg mb-6 focus:outline-none focus:ring-2 focus:ring-blue-500" required /><div className="flex justify-end gap-4"><button type="button" onClick={() => setIsModalOpen(false)} className="px-6 py-2 text-slate-300 hover:bg-slate-700 rounded-lg">Cancel</button><button type="submit" className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700">Create</button></div></form></div></div> )}
            <header className="mb-10"><h1 className="text-4xl font-extrabold text-white">Your Study Groups</h1><p className="text-slate-400 mt-1">Manage, create, and join study groups here.</p></header>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                    <h2 className="text-2xl font-semibold mb-4">All Groups</h2>
                    {/* REMOVED the `min-h-[60vh]` class that was causing the scrollbar */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {groups.map(group => (
                            <div key={group._id} onClick={() => onViewGroup(group._id)} className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-6 hover:bg-slate-700/50 hover:border-blue-500 transition-all duration-200 cursor-pointer backdrop-blur-sm">
                                <h3 className="font-bold text-xl text-slate-200">{group.name}</h3>
                                <p className="text-sm text-slate-400 mt-2">Invite Code: <span className="font-mono bg-slate-700 px-2 py-1 rounded">{group.inviteCode}</span></p>
                            </div>
                        ))}
                        {groups.length === 0 && (<div className="md:col-span-2 text-center py-10 border-2 border-dashed border-slate-700 rounded-lg flex flex-col items-center justify-center"><Icon path="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m-7.5-2.962A3.75 3.75 0 0115 9.75a3.75 3.75 0 01-3.75 3.75a3.75 3.75 0 01-3.75-3.75zM4.5 19.5a3 3 0 013-3h1.5a3 3 0 013 3v.5a.75.75 0 01-1.5 0v-.5a1.5 1.5 0 00-1.5-1.5h-1.5a1.5 1.5 0 00-1.5 1.5v.5a.75.75 0 01-1.5 0v-.5z" className="w-12 h-12 text-slate-600 mb-4" /><p className="text-slate-500">You haven't joined or created any groups yet.</p></div>)}
                    </div>
                </div>
                <div className="space-y-8">
                    <div>
                        <h2 className="text-2xl font-semibold mb-4">Create a Group</h2>
                        <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-6 backdrop-blur-sm text-center">
                            <p className="text-slate-400 mb-4">Start a new collaboration hub.</p>
                            <button onClick={() => setIsModalOpen(true)} className="w-full py-3 font-bold text-lg text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition">Create New Group</button>
                        </div>
                    </div>
                    <div>
                        <h2 className="text-2xl font-semibold mb-4">Join a Group</h2>
                        <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-6 backdrop-blur-sm">
                            <form onSubmit={onJoinGroup} className="flex flex-col gap-4">
                                <input type="text" value={inviteCode} onChange={(e) => setInviteCode(e.target.value.toUpperCase())} placeholder="Enter Invite Code" className="w-full text-center font-mono tracking-widest px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                                <button type="submit" disabled={isRefreshing} className="w-full py-3 font-bold text-lg text-white bg-green-600 rounded-lg hover:bg-green-700 transition disabled:bg-slate-500">Join Group</button>
                                {joinMessage && <p className={`text-sm text-center mt-2 ${joinMessage.includes('successfully') ? 'text-green-400' : 'text-red-400'}`}>{joinMessage}</p>}
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}