const express = require('express')
const app = express()

const http = require('http')
const server = http.createServer(app)

const {Server} = require('socket.io')
const io = new Server(server)

app.get('/', (req, res) =>{

       res.sendFile(__dirname + '/public/chat.html');

});

io.on ('connection', (socket) =>{

    socket.on('chat', (msg)=>{
        io.emit('chat',msg);
        console.log('Mensaje: ' + msg);
    })
});

app.use(express.static('public'));

server.listen(3000, () =>{

     console.log('Servidor corriendo en http://localhost:3000');

})
