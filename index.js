const express = require("express");
const http = require("http");
const path = require("path")
const { Server } = require("socket.io");
const app = express();
const port = 8000;
const server = http.createServer(app);
const io = new Server(server)

//socket io
io.on("connection", (socket) => {
    console.log(`User connected: ${socket.id}`);

    socket.on("join-room", (room) => {
        socket.join(room);
        console.log(`User ${socket.id} joined room ${room}`);
    });

    // Handle audio stream
    socket.on("audio-stream", (stream) => {
        // Broadcast the audio stream to other clients in the same room
        socket.to(room).broadcast.emit("audio-stream", stream);
    });

    // Handle text and audio messages
    socket.on("user-message", (data) => {
        const { room, message } = data;
        io.to(room).emit('message', message);
        console.log(`Message from ${socket.id} in room ${room}: ${message}`);
    });

    socket.on("audio-message", (data) => {
        const { room, audioData } = data;
        // Do something with the audio data, such as broadcasting it to other clients
        io.to(room).emit('audio-message', audioData);
        console.log(`Audio message from ${socket.id} in room ${room}`);
    });

    // Handle disconnection
    socket.on("disconnect", () => {
        console.log(`User disconnected: ${socket.id}`);
    });
});

app.get("/",(req,res) => {
    res.sendFile(path.join(__dirname, "index.html"));
})

server.listen(port,() => {
    console.log("Listnening on port 8000")
})