// --- Use modern 'import' syntax ---
import mongoose from 'mongoose';

// --- Define the Schema ---
// This structure determines what a 'User' document will look like in MongoDB.
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true, // A name is mandatory
      trim: true,     // Removes whitespace from both ends
    },
    email: {
      type: String,
      required: true,
      unique: true,     // Every user must have a unique email
      lowercase: true,  // Converts email to lowercase before saving
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    // This will be an array of Group IDs, creating a link to the Group model.
    groups: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Group',
      },
    ],
    // --- NEW FIELD FOR GAMIFICATION ---
    // This field will store the user's total accumulated points from tasks and study sessions.
    points: {
      type: Number,
      default: 0, // All new users will start with 0 points.
    },
  },
  {
    // Automatically adds 'createdAt' and 'updatedAt' fields
    timestamps: true,
  }
);

// --- Create and Export the Model ---
// 'mongoose.model' compiles the schema into a model we can use in our controllers.
const User = mongoose.model('User', userSchema);

// Use modern 'export default' so we can import it in other files
export default User;

