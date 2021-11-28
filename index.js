const express = require('express')
const app = express()
const cors = require('cors')
app.use(cors())
const server = require('http').Server(app)
const io = require('socket.io')(server)
const { ExpressPeerServer } = require('peer');
const peerServer = ExpressPeerServer(server, {
    debug: true
});

app.use('/peerjs', peerServer);

io.on('connection', socket => {

    console.log("connection");

    socket.on('join-room', (roomId, userId) => {

        console.log("join-room");
        console.log("roomId: " + roomId);
        console.log("userId: " + userId);

        socket.join(roomId)
        socket.to(roomId).broadcast.emit('user-connected', userId);
        // messages
        socket.on('message', (message) => {
            //send message to the same room
            io.to(roomId).emit('createMessage', message)
        });

        socket.on('disconnect', () => {
            console.log("join-room");
            console.log("roomId: " + roomId);
            console.log("userId: " + userId);

            socket.to(roomId).broadcast.emit('user-disconnected', userId)
        })
    })
})


server.listen(process.env.PORT || 3333, () => {
    console.log(`🚀 Socket Server started on port ${process.env.PORT || 3333}!`);
})