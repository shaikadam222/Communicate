const socket = io();

        function joinRoom() {
            const roomInput = document.getElementById("roomInput").value;
            socket.emit("join-room", roomInput);
        }

        function sendMessage() {
            const msg = document.getElementById("messageInput").value;
            const roomInput = document.getElementById("roomInput").value;
            socket.emit("user-message", { room: roomInput, message: msg });
        }

        function startMicrophone() {
            navigator.mediaDevices.getUserMedia({ audio: true })
                .then((stream) => {
                    socket.emit("audio-stream", stream);

                    peer = new SimplePeer({ initiator: true, stream });

                    // Handle WebRTC data events (if needed)
                    peer.on('data', (data) => {
                        console.log('Data received:', data);
                    });
                })
                .catch((error) => {
                    console.error('Error accessing microphone:', error);
                });
        }

        socket.on("message", (message) => {
            const chatMessages = document.getElementById("chatMessages");
            const newMessage = document.createElement("div");
            newMessage.innerText = message;
            chatMessages.appendChild(newMessage);
        });