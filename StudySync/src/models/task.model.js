import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema({
  // Link to the user who this task belongs to.
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  // The text content of the to-do item.
  content: {
    type: String,
    required: true,
    trim: true,
  },
  // The current status of the task.
  status: {
    type: String,
    enum: ['pending', 'completed'], // Can only be one of these two values
    default: 'pending', // New tasks always start as 'pending'
  },
}, {
  timestamps: true,
});

const Task = mongoose.model('Task', taskSchema);

export default Task;
