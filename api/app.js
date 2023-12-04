const express = require('express');
const socket = require( 'socket.io' );
const app = express();
const cors = require('cors');
const port = 4047;

app.use(cors({origin: 'http://localhost:3000' }));
app.get('/', (req, res) => {
    res.send('Hello from Codedamn');
})

const server = app.listen(port, () => {
    console.log('Server running!'+port)
});

const io = socket(server,{
    cors:{
        origin: 'http://localhost:3000'
    }
})

io.on('connection', (socket) => {
    console.log(socket.id +'connected');

    socket.on('join_room', (data)=> {
        console.log('join_room',data)
        socket.join(data);
    });

    socket.on('send_message', (data)=> {
        console.log('send_message',data)
        socket.to(data.room).emit('receive_message', data);
    });

    // socket.io('typing1', (msg)=>{
    //     io.emit('typing1', msg)
    // })

    socket.on('sendTyping', (data)=> {
     console.log(data.name+' is typing in '+data.room)
     io.to(data.room).emit('typing', data)       
    })

    socket.on('disconnect', () => {
        console.log('User disconnected')
    })
})