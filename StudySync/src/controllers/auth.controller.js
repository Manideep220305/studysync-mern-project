// --- Import required modules and models ---
import User from '../models/user.model.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

/**
 * @desc    Register a new user
 * @route   POST /api/auth/register
 * @access  Public
 */
export const registerUser = async (req, res) => {
  try {
    // 1. Get user data from the request body
    const { name, email, password } = req.body;

    // 2. Validate that all fields were provided
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    // 3. Check if a user with this email already exists in the database
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: 'User with this email already exists' });
    }

    // 4. If user doesn't exist, create a new user instance
    user = new User({
      name,
      email,
      password, // The password will be hashed in the pre-save hook in user.model.js
    });

    // 5. Hash the password before saving (using bcryptjs)
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    // 6. Save the new user to the database
    await user.save();

    // 7. Create JWT payload containing the user's unique ID
    const payload = {
      user: {
        id: user.id,
      },
    };

    // 8. Sign the JWT, sending it back to the client for immediate login
    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '5h' }, // Token will be valid for 5 hours
      (err, token) => {
        if (err) throw err;
        res.status(201).json({ token }); // Send token back upon successful registration
      }
    );
  } catch (error) {
    console.error('Registration Error:', error.message);
    res.status(500).json({ message: 'Server error during registration' });
  }
};

/**
 * @desc    Authenticate an existing user and get a token
 * @route   POST /api/auth/login
 * @access  Public
 */
export const loginUser = async (req, res) => {
  try {
    // 1. Get credentials from the request body
    const { email, password } = req.body;

    // 2. Validate that credentials were provided
    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide email and password' });
    }

    // 3. Find the user by their email
    const user = await User.findOne({ email });
    if (!user) {
      // Use a generic message to avoid telling attackers which field is wrong
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // 4. Compare the provided password with the hashed password in the database
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // 5. If credentials are correct, create the JWT payload
    const payload = {
      user: {
        id: user.id,
      },
    };

    // 6. Sign and send the token
    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '5h' },
      (err, token) => {
        if (err) throw err;
        res.json({ token });
      }
    );
  } catch (error) {
    console.error('Login Error:', error.message);
    res.status(500).json({ message: 'Server error during login' });
  }
};


/**
 * @desc    Get the data of the currently logged-in user
 * @route   GET /api/auth/me
 * @access  Private
 */
export const getMe = async (req, res) => {
  try {
    // The user's ID is attached to req.user by our authMiddleware
    // We find the user but exclude the password field for security
    const user = await User.findById(req.user.id).select('-password');
    
    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }
    
    res.json(user);
  } catch (error) {
    console.error('Get User Error:', error.message);
    res.status(500).json({ message: 'Server Error' });
  }
};