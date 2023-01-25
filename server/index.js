const express = require('express')
const http = require('http') /// to setup our socket server with http
const cors = require('cors') // to resolve connection issues for the client
const { Server } = require('socket.io') // import Server class from socket.io library

const port = 3001;
const hostname = '127.0.0.1'

const app = express() 

app.use(cors())

const server = http.createServer(app)

// instantiate Server class of socket.io with first arg is the server on which it will be running and second one is an object dealing with resoving cors issues
const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"]
    }
})

// detecting connection with this socketIO server
// listening to the 'connection' event
io.on('connection', (socket)=>{
    console.log(`User connected: ${socket.id}`) // gives the id of the user connected with our socket server

    // listen on join_room event to join a room from client side
    socket.on('join_room', (data)=>{
        console.log(`User with id : ${socket.id} joind the room with id: ${data}`)
        socket.join(data) // join the room
    })

    // listening on 'send_message'(client side event) event to recieve user's message sent from client side
    socket.on('send_message',(data)=>{
        console.log(`${data.author} sent : ${data.msg} in room: ${data.room}`)

        // Once the message is recieved from some user, emit the same message to all the users connected to this room except this user
        socket.to(data.room).emit("recieve_message", data)
        //socket.to(data.room) - ensures that we will be sending the message to the other users connected to the same room from where this user is connected
    })

    // Each socket also fires a special disconnect event:
    socket.on('disconnect', ()=>{
        console.log(`User disconnected : ${socket.id}`) // This will execute when the user disconnects or close the client side page
    })
})


server.listen(port, hostname, ()=>{
    console.log("listening at port", port)
})