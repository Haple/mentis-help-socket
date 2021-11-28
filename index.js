const express = require('express')
const app = express()
const cors = require('cors')
app.use(cors())
const server = require('http').Server(app)
const io = require('socket.io')(server)

app.set('view engine', 'ejs')
app.use(express.static('public'))

io.on('connection', socket => {
    console.log("CONNECT");

    socket.on('join-room', (roomId, userId) => {

        console.log("JOIN-ROOM");
        console.log("roomId: " + roomId);
        console.log("userId: " + userId);
        socket.join(roomId)
        socket.to(roomId).broadcast.emit('user-connected', userId)

        socket.on('disconnect', () => {
            console.log("DISCONNECT");
            console.log("userId: " + userId);

            socket.to(roomId).broadcast.emit('user-disconnected', userId)
        })
    })
})

server.listen(process.env.PORT || 3333, () => {
    console.log(`🚀 Socket Server started on port ${process.env.PORT || 3333}!`);
})