import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
  // Link to the group this message belongs to.
  group: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Group',
    required: true,
  },
  // Link to the user who sent the message.
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  // The actual text content of the message.
  content: {
    type: String,
    required: true,
    trim: true,
  },
}, {
  // Automatically adds `createdAt` and `updatedAt` fields.
  timestamps: true,
});

const Message = mongoose.model('Message', messageSchema);

export default Message;

