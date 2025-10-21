import { Server } from 'socket.io';
import Message from './models/message.model.js';
import User from './models/user.model.js';

const initializeSocket = (server) => {
  // Create a new Socket.io server instance, allowing requests from any origin (CORS)
  const io = new Server(server, {
    cors: {
      origin: "*", // For development, we allow all origins.
    },
  });

  // This is the main connection event listener.
  // It runs every time a new client connects to our server.
  io.on('connection', (socket) => {
    console.log(`🔌 New user connected: ${socket.id}`);

    // --- 1. Event Listener for a user joining a group's chat room ---
    socket.on('join_group', (groupId) => {
      // The `socket.join()` method subscribes the client to a specific room.
      // Now, this client will receive any messages broadcast to this `groupId` room.
      socket.join(groupId);
      console.log(`User ${socket.id} joined group room: ${groupId}`);
    });

    // --- 2. Event Listener for a new message being sent ---
    socket.on('send_message', async (data) => {
      try {
        const { groupId, senderId, content } = data;

        // A. Save the new message to the database
        const newMessage = new Message({
          group: groupId,
          sender: senderId,
          content: content,
        });
        let savedMessage = await newMessage.save();

        // B. Populate the sender's name before sending it to clients
        // We need to do this manually because the document from .save() doesn't have it.
        savedMessage = await savedMessage.populate({
            path: 'sender',
            select: 'name'
        });

        // C. Broadcast the new message to everyone in the correct group room.
        // `io.to(groupId)` ensures the message ONLY goes to clients in that room.
        io.to(groupId).emit('receive_message', savedMessage);
        
      } catch (error) {
        console.error('Socket.io send_message error:', error);
      }
    });


    // --- 3. Event Listener for when a user disconnects ---
    socket.on('disconnect', () => {
      console.log(`🔥 User disconnected: ${socket.id}`);
    });
  });
};

export default initializeSocket;

