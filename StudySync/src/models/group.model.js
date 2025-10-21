// src/models/group.model.js

// --- Use modern 'import' syntax ---
import mongoose from 'mongoose';

// --- Define the Schema ---
// This structure determines what a 'Group' document will look like in MongoDB.
const groupSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    // A single user ID that references the group's owner.
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    // An array of user IDs for all members in the group.
    members: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    inviteCode: {
      type: String,
      required: true,
      unique: true,
    },
  },
  {
    // Automatically adds 'createdAt' and 'updatedAt' fields
    timestamps: true,
  }
);

// --- Create and Export the Model ---
const Group = mongoose.model('Group', groupSchema);

// Use modern 'export default' so we can import it in other files
export default Group;