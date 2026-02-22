const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173", // Vite default port
        methods: ["GET", "POST"]
    }
});

io.on('connection', (socket) => {
    console.log(`User connected: ${socket.id}`);

    // Broadcast to all when a user joins
    socket.broadcast.emit('message', {
        user: 'System',
        text: `User ${socket.id.substring(0, 5)}... has joined the chat.`,
        time: new Date().toLocaleTimeString()
    });

    // Handle incoming chat messages
    socket.on('sendMessage', (data) => {
        const messageData = {
            ...data,
            id: Math.random().toString(36).substr(2, 9),
            time: new Date().toLocaleTimeString()
        };
        // Emit to everyone including sender
        io.emit('message', messageData);
    });

    socket.on('disconnect', () => {
        console.log(`User disconnected: ${socket.id}`);
        io.emit('message', {
            user: 'System',
            text: `User ${socket.id.substring(0, 5)}... has left the chat.`,
            time: new Date().toLocaleTimeString()
        });
    });
});

const PORT = process.env.PORT || 7000;
server.listen(PORT, () => {
    console.log(`Socket.io server running on http://localhost:${PORT}`);
});
