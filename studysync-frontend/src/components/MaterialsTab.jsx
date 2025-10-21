// src/components/MaterialsTab.jsx

import React, { useState, useEffect, useCallback } from 'react';
import Icon from './Icon';
const API_URL = 'http://localhost:5000';

export default function MaterialsTab({ groupId, token }) {
    const [materials, setMaterials] = useState([]);
    const [loading, setLoading] = useState(true);

    // --- NEW: State for the upload form ---
    const [file, setFile] = useState(null);
    const [subject, setSubject] = useState('');
    const [uploading, setUploading] = useState(false);
    const [uploadMessage, setUploadMessage] = useState('');

    const fetchMaterials = useCallback(async () => {
        if (!groupId) return;
        setLoading(true);
        try {
            const res = await fetch(`${API_URL}/api/groups/${groupId}/materials`, {
                headers: { 'x-auth-token': token }
            });
            const data = await res.json();
            if (!res.ok) throw new Error('Failed to fetch materials');
            setMaterials(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }, [groupId, token]);

    useEffect(() => {
        fetchMaterials();
    }, [fetchMaterials]);
    
    // --- NEW: Function to handle the file upload ---
    const handleUpload = async (e) => {
        e.preventDefault();
        if (!file) {
            setUploadMessage('Please select a file to upload.');
            return;
        }
        setUploading(true);
        setUploadMessage('');

        // FormData is the standard way to send files via fetch
        const formData = new FormData();
        formData.append('file', file);
        formData.append('subject', subject || 'General');

        try {
            const res = await fetch(`${API_URL}/api/groups/${groupId}/upload`, {
                method: 'POST',
                headers: { 'x-auth-token': token },
                body: formData, // When using FormData, the browser sets the Content-Type header automatically
            });
            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || 'Upload failed.');
            }

            setUploadMessage('File uploaded successfully!');
            setFile(null); // Reset the file input
            setSubject(''); // Reset the subject input
            e.target.reset(); // Reset the form fields
            await fetchMaterials(); // Refresh the list of materials

        } catch (error) {
            setUploadMessage(error.message);
        } finally {
            setUploading(false);
        }
    };


    if (loading) {
        return <div className="p-6 text-center text-slate-400">Loading materials...</div>;
    }

    return (
        <div className="p-6">
            {/* --- NEW: The Upload Form --- */}
            <form onSubmit={handleUpload} className="mb-8 p-6 bg-slate-900/50 border border-slate-700 rounded-lg space-y-4">
                <h3 className="text-xl font-semibold text-slate-200">Upload New Material</h3>
                <div className="flex flex-col sm:flex-row gap-4">
                    <input 
                        type="file" 
                        onChange={(e) => setFile(e.target.files[0])}
                        className="flex-grow w-full text-sm text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-600/20 file:text-blue-300 hover:file:bg-blue-600/40"
                    />
                     <input 
                        type="text"
                        placeholder="Subject (e.g., 'DSA Notes')"
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                        className="p-2 bg-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
                <button type="submit" disabled={uploading} className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 transition disabled:bg-slate-600">
                    <Icon path="M12 4.5v15m7.5-7.5h-15" className="w-5 h-5" />
                    {uploading ? 'Uploading...' : 'Upload File'}
                </button>
                {uploadMessage && <p className={`text-sm text-center ${uploadMessage.includes('successfully') ? 'text-green-400' : 'text-red-400'}`}>{uploadMessage}</p>}
            </form>
            
            <h3 className="text-xl font-semibold text-slate-200 mb-4">Shared Materials</h3>
            {materials.length > 0 ? (
                <ul className="space-y-3">
                    {materials.map(material => (
                        <li key={material._id} className="bg-slate-700/50 p-4 rounded-lg flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <Icon path="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" className="w-6 h-6 text-slate-400"/>
                                <div>
                                    <a href={material.fileUrl} target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-400 hover:underline">
                                        {material.fileName}
                                    </a>
                                    <p className="text-xs text-slate-400">
                                        Uploaded by {material.uploadedBy.name} on {new Date(material.createdAt).toLocaleDateString()}
                                    </p>
                                </div>
                            </div>
                            <span className="text-xs bg-slate-600 px-2 py-1 rounded-full font-medium">{material.subject}</span>
                        </li>
                    ))}
                </ul>
            ) : (
                <div className="text-center py-10 border-2 border-dashed border-slate-700 rounded-lg">
                    <p className="text-slate-500">No materials have been uploaded to this group yet.</p>
                </div>
            )}
        </div>
    );
}