// src/routes/group.routes.js

import express from 'express';
import { authMiddleware } from '../middleware/auth.middleware.js';
import upload from '../middleware/upload.middleware.js';
import { 
    createGroup, joinGroup, getMyGroups, getGroupDetails,
    leaveGroup, deleteGroup, uploadMaterial, getGroupMessages, getGroupMaterials 
} from '../controllers/group.controller.js';

const router = express.Router();

// Specific routes must come before parameterized routes
router.get('/mygroups', authMiddleware, getMyGroups);

// Core Group Management
router.post('/', authMiddleware, createGroup);
router.post('/join', authMiddleware, joinGroup);
router.get('/:groupId', authMiddleware, getGroupDetails);
router.delete('/:groupId', authMiddleware, deleteGroup);

// --- THIS IS THE FIX ---
// Changed from .post() to .patch() for correct HTTP semantics
router.patch('/:groupId/leave', authMiddleware, leaveGroup);

// Collaboration Features
router.post('/:groupId/upload', authMiddleware, upload.single('file'), uploadMaterial);
router.get('/:groupId/messages', authMiddleware, getGroupMessages);
router.get('/:groupId/materials', authMiddleware, getGroupMaterials);

export default router;