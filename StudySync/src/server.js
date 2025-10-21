// --- Import Core Libraries ---
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import http from 'http'; // 1. Import Node's built-in http module

// --- Import App and Socket Handler ---
import app from './app.js';
import initializeSocket from './socket.js'; // 2. Import our new socket initializer

// --- Load Environment Variables ---
dotenv.config();

// --- Define Port ---
const PORT = process.env.PORT || 5000;

// 3. Create a new HTTP server and pass our Express app to it
const server = http.createServer(app);

// 4. Initialize our Socket.io server and pass the HTTP server to it
initializeSocket(server);

// --- Database Connection and Server Startup ---
const startServer = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Successfully connected to MongoDB!');

    // 5. IMPORTANT: Call .listen() on the 'server', not the 'app'
    server.listen(PORT, () => {
      console.log(`Server is running on port: ${PORT}`);
    });
    
  } catch (error) {
    console.error('Connection error', error.message);
    process.exit(1);
  }
};

// --- Execute the Server Start ---
startServer();
