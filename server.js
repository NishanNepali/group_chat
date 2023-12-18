const express = require('express');
const http = require('http');
const socketIO = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

// Track connected users
let userCount = 0;

io.on('connection', (socket) => {
    // Increment user count when a user connects
    userCount++;
    io.emit('userCount', userCount);

    console.log('a user connected');

    socket.on('disconnect', () => {
        // Decrement user count when a user disconnects
        userCount--;
        io.emit('userCount', userCount);
        console.log('user disconnected');
    });

    socket.on('chat message', (msg) => {
        io.emit('chat message', msg);
    });
});

app.use(express.static(__dirname));

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});
