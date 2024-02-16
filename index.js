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
    socket.on("user-message",(message) => {
        io.emit('message',message)
        console.log(message)
    })
})
app.get("/",(req,res) => {
    res.sendFile(path.join(__dirname, "index.html"));
})

server.listen(port,() => {
    console.log("Listnening on port 8000")
})