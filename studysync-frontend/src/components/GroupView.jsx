// src/components/GroupView.jsx

import React, { useState, useEffect, useRef } from 'react';
import { io } from "socket.io-client";
import MaterialsTab from './MaterialsTab'; 
const API_URL = 'http://localhost:5000';

export default function GroupView({ groupId, token, user, onBack, onDeleteGroup, onLeaveGroup }) {
    const [groupData, setGroupData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('chat');
    const [socket, setSocket] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const messageContainerRef = useRef(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showLeaveModal, setShowLeaveModal] = useState(false);

    useEffect(() => {
        const fetchGroupDetails = async () => {
            if (!groupId) return;
            setLoading(true);
            try {
                const res = await fetch(`${API_URL}/api/groups/${groupId}`, { headers: { 'x-auth-token': token } });
                const data = await res.json();
                if (!res.ok) throw new Error('Failed to fetch group details');
                setGroupData(data);
            } catch (error) { console.error(error); } finally { setLoading(false); }
        };
        fetchGroupDetails();
    }, [groupId, token]);

    useEffect(() => {
        if (!groupId || activeTab !== 'chat') {
            if (socket) socket.disconnect();
            return;
        };
        const newSocket = io(API_URL);
        setSocket(newSocket);
        newSocket.emit('join_group', groupId);
        newSocket.on('receive_message', (message) => { setMessages(prev => [...prev, message]); });
        const fetchMessages = async () => {
            try {
                const res = await fetch(`${API_URL}/api/groups/${groupId}/messages`, { headers: { 'x-auth-token': token } });
                const data = await res.json();
                if (res.ok) setMessages(data);
            } catch (error) { console.error("Failed to fetch messages", error); }
        };
        fetchMessages();
        return () => { newSocket.disconnect(); };
    }, [groupId, token, activeTab]);

    useEffect(() => {
        if (messageContainerRef.current) {
            messageContainerRef.current.scrollTop = messageContainerRef.current.scrollHeight;
        }
    }, [messages]);

    const handleSendMessage = (e) => {
        e.preventDefault();
        if (newMessage.trim() && socket && user) {
            const messageData = { groupId, senderId: user._id, content: newMessage.trim() };
            socket.emit('send_message', messageData);
            setNewMessage('');
        }
    };

    if (loading) { return <div className="text-center p-10 text-slate-400">Loading Group...</div>; }
    if (!groupData) { return <div className="text-center p-10 text-red-400">Failed to load group.</div>; }

    const isOwner = user && groupData && groupData.owner && user._id === groupData.owner._id;

    const renderChat = () => ( <div className="flex flex-col h-full"><div ref={messageContainerRef} className="flex-grow overflow-y-auto p-4 space-y-4">{messages.map(msg => (<div key={msg._id} className={`flex flex-col w-fit max-w-lg ${msg.sender?._id === user._id ? 'self-end items-end' : 'self-start items-start'}`}><div className={`p-3 rounded-xl ${msg.sender?._id === user._id ? 'bg-blue-600' : 'bg-slate-700'}`}><p className="font-bold text-sm text-slate-300">{msg.sender?._id === user._id ? 'You' : msg.sender?.name}</p><p className="text-md text-white">{msg.content}</p></div><p className="text-xs text-slate-500 mt-1">{new Date(msg.createdAt).toLocaleTimeString()}</p></div>))}</div><form onSubmit={handleSendMessage} className="p-4 border-t border-slate-700/50 flex gap-2"><input type="text" value={newMessage} onChange={(e) => setNewMessage(e.target.value)} placeholder="Type your message..." className="flex-grow p-3 bg-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" /><button type="submit" className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition">Send</button></form></div> );
    const renderMaterials = () => <MaterialsTab groupId={groupId} token={token} />;
    const renderMembers = () => ( <div className="p-6"><ul className="space-y-3">{groupData.members.map(member => (<li key={member._id} className="flex items-center space-x-3 p-2 rounded-md"><div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center font-bold text-sm text-white">{member.name.charAt(0).toUpperCase()}</div><span className="text-slate-300">{member.name}</span></li>))}</ul></div> );
    const renderSettings = () => (
        <div className="p-6">
            <h3 className="text-xl font-bold text-red-400 mb-4">Danger Zone</h3>
            {isOwner ? (
                <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-4 flex items-center justify-between">
                    <div><p className="font-semibold text-slate-200">Delete this group</p><p className="text-sm text-slate-400">Once deleted, it's gone forever.</p></div>
                    <button onClick={() => setShowDeleteModal(true)} className="px-4 py-2 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700">Delete</button>
                </div>
            ) : (
                <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-4 flex items-center justify-between">
                    <div><p className="font-semibold text-slate-200">Leave this group</p><p className="text-sm text-slate-400">You can always rejoin later with an invite code.</p></div>
                    <button onClick={() => setShowLeaveModal(true)} className="px-4 py-2 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700">Leave</button>
                </div>
            )}
        </div>
    );

    return (
        <div className="flex flex-col h-full">
            {showDeleteModal && ( <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center"><div className="bg-slate-800 p-8 rounded-lg shadow-xl w-full max-w-sm"><h3 className="text-xl font-bold text-white">Are you sure?</h3><p className="text-slate-400 my-4">This action cannot be undone. You will permanently delete the "{groupData.name}" group.</p><div className="flex justify-end gap-4 mt-6"><button onClick={() => setShowDeleteModal(false)} className="px-4 py-2 text-slate-300 hover:bg-slate-700 rounded-md">Cancel</button><button onClick={() => { setShowDeleteModal(false); onDeleteGroup(groupId); }} className="px-4 py-2 bg-red-600 text-white font-semibold rounded-md hover:bg-red-700">Confirm & Delete</button></div></div></div> )}
            {showLeaveModal && ( <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center"><div className="bg-slate-800 p-8 rounded-lg shadow-xl w-full max-w-sm"><h3 className="text-xl font-bold text-white">Leave Group?</h3><p className="text-slate-400 my-4">Are you sure you want to leave the "{groupData.name}" group?</p><div className="flex justify-end gap-4 mt-6"><button onClick={() => setShowLeaveModal(false)} className="px-4 py-2 text-slate-300 hover:bg-slate-700 rounded-md">Cancel</button><button onClick={() => { setShowLeaveModal(false); onLeaveGroup(groupId); }} className="px-4 py-2 bg-red-600 text-white font-semibold rounded-md hover:bg-red-700">Confirm & Leave</button></div></div></div> )}
            <header className="mb-6"><button onClick={onBack} className="text-sm text-blue-400 hover:underline mb-4">&larr; Back to Groups</button><h1 className="text-4xl font-extrabold text-white">{groupData.name}</h1></header>
            <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl flex flex-col flex-grow backdrop-blur-sm">
                <div className="flex border-b border-slate-700/50">
                    <button onClick={() => setActiveTab('chat')} className={`px-6 py-3 font-semibold ${activeTab === 'chat' ? 'text-blue-400 border-b-2 border-blue-400' : 'text-slate-400'}`}>Chat</button>
                    <button onClick={() => setActiveTab('materials')} className={`px-6 py-3 font-semibold ${activeTab === 'materials' ? 'text-blue-400 border-b-2 border-blue-400' : 'text-slate-400'}`}>Materials</button>
                    <button onClick={() => setActiveTab('members')} className={`px-6 py-3 font-semibold ${activeTab === 'members' ? 'text-blue-400 border-b-2 border-blue-400' : 'text-slate-400'}`}>Members</button>
                    <button onClick={() => setActiveTab('settings')} className={`px-6 py-3 font-semibold ${activeTab === 'settings' ? 'text-red-400 border-b-2 border-red-400' : 'text-slate-400'}`}>Settings</button>
                </div>
                <div className="flex-grow overflow-y-auto relative h-full">
                    {activeTab === 'chat' && renderChat()}
                    {activeTab === 'materials' && renderMaterials()}
                    {activeTab === 'members' && renderMembers()}
                    {activeTab === 'settings' && renderSettings()}
                </div>
            </div>
        </div>
    );
}