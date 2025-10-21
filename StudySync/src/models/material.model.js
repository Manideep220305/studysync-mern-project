import mongoose from 'mongoose';

const materialSchema = new mongoose.Schema({
  group: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Group',
    required: true,
  },
  uploadedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  fileName: {
    type: String,
    required: true,
  },
  fileUrl: {
    type: String,
    required: true,
  },
  subject: {
    type: String,
    trim: true,
  },
}, {
  timestamps: true,
});

const Material = mongoose.model('Material', materialSchema);

export default Material;

