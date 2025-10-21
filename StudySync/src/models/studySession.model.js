import mongoose from 'mongoose';

const studySessionSchema = new mongoose.Schema({
  // Link to the user who this session belongs to.
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  // Optional: Link to the group if it's a group study session.
  group: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Group',
    default: null, // Null if it's an individual session
  },
  // Optional: Link to a specific task from the to-do list.
  task: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Task', // We will create this model next
    default: null,
  },
  // The exact time the timer was started.
  startTime: {
    type: Date,
    required: true,
  },
  // The time the timer was stopped. Will be null if session is active.
  endTime: {
    type: Date,
    default: null,
  },
  // The total duration of the session in minutes, calculated on stop.
  duration: {
    type: Number, // Storing duration in minutes
    default: 0,
  },
  // The current status of the session.
  status: {
    type: String,
    enum: ['active', 'completed'],
    default: 'active',
  },
}, {
  timestamps: true,
});

const StudySession = mongoose.model('StudySession', studySessionSchema);

export default StudySession;
