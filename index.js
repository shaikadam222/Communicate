const express = require("express");
const http = require("http");
const path = require("path")
const { Server } = require("socket.io");
const app = express();
const port = 8000;
const server = http.createServer(app);
const io = new Server(server)

//socket io
io.on("connection",(socket) => {
    console.log(`user connected: ${socket.id}`)

    socket.on("join-room",(room) => {
        socket.join(room);
        console.log(`User ${socket.id} joined room ${room}`)
    })


    socket.on("user-message",(data) => {
        const {room,message} = data;
        io.to(room).emit('message',message)
        console.log(`message from ${socket.id} in room ${room}: ${message}`)
    });

    socket.on("disconnect",() => {
        console.log(`User disconnected: ${socket.id}`);
    })
})
app.get("/",(req,res) => {
    res.sendFile(path.join(__dirname, "index.html"));
})

server.listen(port,() => {
    console.log("Listnening on port 8000")
})