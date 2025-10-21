// src/controllers/group.controller.js

// --- Import all the necessary Models and Libraries ---
import Group from '../models/group.model.js';
import User from '../models/user.model.js';
import Material from '../models/material.model.js';
import Message from '../models/message.model.js';
import cloudinary from '../utils/cloudinary.js';
import { nanoid } from 'nanoid';
// We need the 'path' module to correctly parse filenames.
import path from 'path'; 

/**
 * @desc    Create a new study group for the logged-in user.
 * @route   POST /api/groups
 */
export const createGroup = async (req, res) => {
    try {
        const { name } = req.body;
        const ownerId = req.user.id;
        if (!name) return res.status(400).json({ message: 'Please provide a group name.' });
        const inviteCode = nanoid(6).toUpperCase();
        const newGroup = new Group({ name, owner: ownerId, members: [ownerId], inviteCode });
        const savedGroup = await newGroup.save();
        await User.findByIdAndUpdate(ownerId, { $push: { groups: savedGroup._id } });
        res.status(201).json(savedGroup);
    } catch (error) {
        console.error('Create Group Error:', error.message);
        res.status(500).json({ message: 'Server error' });
    }
};

/**
 * @desc    Allow the logged-in user to join an existing group using an invite code.
 * @route   POST /api/groups/join
 */
export const joinGroup = async (req, res) => {
    try {
        const { inviteCode } = req.body;
        const userId = req.user.id;
        if (!inviteCode) return res.status(400).json({ message: 'Please provide an invite code' });
        const group = await Group.findOne({ inviteCode });
        if (!group) return res.status(404).json({ message: 'Group not found with this invite code' });
        if (group.members.includes(userId)) return res.status(400).json({ message: 'You are already a member of this group' });
        group.members.push(userId);
        await group.save();
        await User.findByIdAndUpdate(userId, { $push: { groups: group._id } });
        res.status(200).json({ message: 'Successfully joined the group!', group });
    } catch (error) {
        console.error('Join Group Error:', error.message);
        res.status(500).json({ message: 'Server error' });
    }
};

/**
 * @desc      Upload a study material file to a specific group.
 * @route     POST /api/groups/:groupId/upload
 */
export const uploadMaterial = async (req, res) => {
    try {
        const groupId = req.params.groupId;
        const userId = req.user.id;

        // 1. Security Check: Ensure the user is part of the group.
        const group = await Group.findById(groupId);
        if (!group || !group.members.includes(userId)) return res.status(403).json({ message: 'Not authorized to upload to this group' });
        
        // 2. Check if a file was actually sent by the frontend.
        if (!req.file) return res.status(400).json({ message: 'No file uploaded.' });

        // 3. Determine the Cloudinary resource type. 'raw' is for non-media files like PDFs.
        let resourceType = 'raw'; 
        if (req.file.mimetype.startsWith('image')) {
            resourceType = 'image';
        } else if (req.file.mimetype.startsWith('video')) {
            resourceType = 'video';
        }

        // 4. THE REAL FIX: We take control of the filename.
        //    The debug logs showed Cloudinary was ignoring 'use_filename: true' and creating a random string.
        //    So, we will manually create the filename and force Cloudinary to use it.
        
        //    Example: 'GR22-B.Tech-ML-labmanual.pdf' -> 'GR22-B.Tech-ML-labmanual'
        const filenameWithoutExt = path.parse(req.file.originalname).name;

        // 5. Convert the file buffer into a Base64 string that Cloudinary can read.
        const b64 = Buffer.from(req.file.buffer).toString("base64");
        let dataURI = "data:" + req.file.mimetype + ";base64," + b64;
        
        // 6. Send to Cloudinary with options that give US control.
        const result = await cloudinary.uploader.upload(dataURI, {
            resource_type: resourceType,
            folder: `StudySync/${groupId}`,
            // We EXPLICITLY set the public_id. This is us telling Cloudinary the exact name to use.
            public_id: filenameWithoutExt,
            // We turn this OFF because the logs showed it was causing the random string generation.
            unique_filename: false,
            // If a user uploads the same file again, this will just replace the old one.
            overwrite: true,
        });
        
        // 7. Save the correct information to our database.
        const newMaterial = new Material({
            group: groupId,
            uploadedBy: userId,
            fileName: req.file.originalname,
            fileUrl: result.secure_url,
            subject: req.body.subject || 'General'
        });
        await newMaterial.save();

        // 8. Send success response back to the frontend.
        res.status(201).json({ message: "File uploaded successfully!", material: newMaterial });
    } catch (error) {
        console.error('File Upload Error:', error.message);
        res.status(500).json({ message: 'Server error during file upload.' });
    }
};


// --- The rest of these functions are for data retrieval and management ---

export const getMyGroups = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).populate({ path: 'groups', select: 'name owner inviteCode' });
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.status(200).json(user.groups);
    } catch (error) {
        console.error('Get My Groups Error:', error.message);
        res.status(500).json({ message: 'Server error' });
    }
};

export const getGroupDetails = async (req, res) => {
    try {
        const groupId = req.params.groupId;
        const userId = req.user.id;
        const group = await Group.findById(groupId).populate({ path: 'members', select: 'name email' });
        if (!group) return res.status(404).json({ message: 'Group not found' });
        const isMember = group.members.some(member => member._id.toString() === userId);
        if (!isMember) return res.status(403).json({ message: 'Not authorized to view this group' });
        res.status(200).json(group);
    } catch (error) {
        console.error('Get Group Details Error:', error.message);
        res.status(500).json({ message: 'Server error' });
    }
};

export const leaveGroup = async (req, res) => {
    try {
        const groupId = req.params.groupId;
        const userId = req.user.id;
        await Group.findByIdAndUpdate(groupId, { $pull: { members: userId } });
        await User.findByIdAndUpdate(userId, { $pull: { groups: groupId } });
        res.status(200).json({ message: 'You have successfully left the group' });
    } catch (error) {
        console.error('Leave Group Error:', error.message);
        res.status(500).json({ message: 'Server error' });
    }
};

export const deleteGroup = async (req, res) => {
    try {
        const groupId = req.params.groupId;
        const userId = req.user.id;
        const group = await Group.findById(groupId);
        if (!group) return res.status(404).json({ message: 'Group not found' });
        if (group.owner.toString() !== userId) {
            return res.status(403).json({ message: 'Only the group owner can delete this group' });
        }
        await Group.findByIdAndDelete(groupId);
        await User.updateMany({ _id: { $in: group.members } }, { $pull: { groups: groupId } });
        res.status(200).json({ message: 'Group successfully deleted' });
    } catch (error) {
        console.error('Delete Group Error:', error.message);
        res.status(500).json({ message: 'Server error' });
    }
};

export const getGroupMessages = async (req, res) => {
    try {
        const groupId = req.params.groupId;
        const userId = req.user.id;
        const group = await Group.findById(groupId);
        if (!group || !group.members.includes(userId)) {
            return res.status(403).json({ message: 'Not authorized to view these messages' });
        }
        const messages = await Message.find({ group: groupId }).sort({ createdAt: 1 }).populate({ path: 'sender', select: 'name' });
        res.status(200).json(messages);
    } catch (error) {
        console.error('Get Messages Error:', error.message);
        res.status(500).json({ message: 'Server error' });
    }
};

export const getGroupMaterials = async (req, res) => {
    try {
        const groupId = req.params.groupId;
        const userId = req.user.id;
        const group = await Group.findById(groupId);
        if (!group || !group.members.includes(userId)) {
            return res.status(403).json({ message: 'Not authorized to view these materials' });
        }
        const materials = await Material.find({ group: groupId }).sort({ createdAt: -1 }).populate({ path: 'uploadedBy', select: 'name' });
        res.status(200).json(materials);
    } catch (error) {
        console.error('Get Materials Error:', error.message);
        res.status(500).json({ message: 'Server error' });
    }
};
