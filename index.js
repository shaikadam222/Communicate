const express = require("express");
const http = require("http");
const path = require("path");
const { Server } = require("socket.io");
const app = express();
const port = 8000;
const server = http.createServer(app);
const io = new Server(server);

// Global object to store rooms and their users
const rooms = {};

io.on("connection", (socket) => {
    console.log(`User connected: ${socket.id}`);

    socket.on("join-room", (data) => {
        const { room } = data;
        socket.join(room);

        // Add the user to the room's user list
        if (!rooms[room]) {
            rooms[room] = [];
        }
        rooms[room].push(socket.id);

        console.log(`User ${socket.id} joined room ${room}`);
    });

    socket.on("user-message", (data) => {
        const { room, message } = data;
        io.to(room).emit("message", message);
        console.log(`Message from ${socket.id} in room ${room}: ${message}`);
    });

    // Handle audio stream
    socket.on("audio-stream", (data) => {
        const { room, stream } = data;

        // Broadcast the audio stream to other clients in the same room
        socket.to(room).broadcast.emit("audio-stream", stream);

        console.log(`Audio stream from ${socket.id} in room ${room}`);
    });

    // Handle audio messages
    socket.on("audio-message", (data) => {
        const { room, audioData } = data;

        // Broadcast the audio message to other clients in the same room
        socket.to(room).broadcast.emit("audio-message", audioData);

        console.log(`Audio message from ${socket.id} in room ${room}`);
    });

    socket.on("disconnect", () => {
        console.log(`User disconnected: ${socket.id}`);

        // Remove the user from the room's user list
        for (const room in rooms) {
            const index = rooms[room].indexOf(socket.id);
            if (index !== -1) {
                rooms[room].splice(index, 1);
                break;
            }
        }
    });
});

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "index.html"));
});

server.listen(port, () => {
    console.log(`Listening on port ${port}`);
});
