// 1. Change 'require' to 'import'
import jwt from 'jsonwebtoken';

// 2. Add the 'export' keyword here to make it a named export
export const authMiddleware = (req, res, next) => {
  // Get token from the request header
  const token = req.header('x-auth-token');

  // Check if token doesn't exist
  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  // If token exists, verify it
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Add the user payload from the token to the request object
    req.user = decoded.user;
    
    // Call the next function to proceed
    next();
  } catch (error) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};

// 3. Delete the old 'module.exports' line
// module.exports = authMiddleware; <-- DELETE THIS