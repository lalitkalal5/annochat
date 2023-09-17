const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);
const path = require('path');

// app.use(express.static(__dirname + '/public'));
// app.use('/static', express.static(path.join(__dirname, '/public')))
app.use(express.static('public'));
app.get('/',(req,res)=>{
    res.sendFile(__dirname +'/public/index.html')
});
app.get('/otv',(req,res)=>{
    res.sendFile(__dirname +'/public/ome.html')
});
app.get('/grp',(req,res)=>{
    res.sendFile(__dirname+'/public/group.html')
});
app.get('/contact',(req,res)=>{
    res.sendFile(__dirname+'/public/contacts.html')
});
const waitingUsers = [];
let roomCounter = 1;
totaljanta =[];
const users = {};
const userRooms = {};



io.on('connection', (socket) => {
    console.log("a user connected", socket.id);
    totaljanta.push(socket.id)
    socket.on('sendusername',(data) =>{
        console.log(`${data} joined`)
        socket.broadcast.emit('brdcast',data);
    });
    socket.emit('totaljanta',totaljanta.length);
    // if (waitingUsers.length > 0 ) {
    //     const partnerSocketId = waitingUsers.pop();
    //     const roomName = `room-${roomCounter}`;

    //     socket.join(roomName);
    //     // partnerSocketId.join(roomName);
    //     const partnerSocket = io.sockets.sockets.get(partnerSocketId);
    //     partnerSocket.join(roomName);
    //     socket.room = roomName;
    //     partnerSocket.room = roomName;
    //     console.log('user joined in a room',socket.id,partnerSocket.id);
    //     console.log(waitingUsers);
    //     io.to(socket.room).emit('partnerjoined', roomName);

        // roomCounter++;}
    //     else {
    //     waitingUsers.push(socket.id);
    //     console.log('user joined in waiting list',socket.id);
    //     console.log(waitingUsers);
    // };
socket.on('addlist',(data)=>{
    // waitingUsers.push(data);
    // console.log(waitingUsers);
    if (waitingUsers.length > 0 ) {
        const partnerSocketId = waitingUsers.pop();
        const roomName = `room-${roomCounter}`;

        socket.join(roomName);
        // partnerSocketId.join(roomName);
        const partnerSocket = io.sockets.sockets.get(partnerSocketId);
        partnerSocket.join(roomName);
        socket.room = roomName;
        partnerSocket.room = roomName;
        console.log('user joined in a room',socket.id,partnerSocket.id);
        console.log(waitingUsers);
        socket.to(socket.room).emit('waitbf',roomName);
        io.to(socket.room).emit('partnerjoined', roomName);

        roomCounter++;}else{
        waitingUsers.push(socket.id);
        socket.emit('waitmf',socket.id);
        console.log('user joined in waiting list',socket.id);
        console.log(waitingUsers);
        }
});
    socket.on('endchat',()=>{
     socket.disconnect();
});
    socket.on('sendMessage', ( msg ) => {
        console.log(`rcvd msg is ${msg}`);
        // const roomName = Object.keys(socket.rooms).find(room => room !== socket.id);
        socket.to(socket.room).emit('recieveMessage', {msg});
    });
    socket.on('disconnect', () => {
        console.log(socket.id, 'disconnected');
        // users.pop(x);
        io.to(socket.room).emit('userleft');
        socket.leave(socket.room);
      const disconnectedRoom = userRooms[socket.id];
        // console.log(disconnectedRoom);
        if (disconnectedRoom){
        const disconnectedUsername = users[socket.id];
        // console.log(disconnectedUsername);
        socket.to(disconnectedRoom).emit('chhodgya',disconnectedUsername);
            delete userRooms[socket.id];
        }
        totaljanta.pop(socket.id);
        // const partnerSocket = io.sockets.sockets.get(partnerSocketId);
        // partnerSocket.leave(socket.room);
        // partnerSocket.push(waitingUsers);
        console.log(waitingUsers);
        const index = waitingUsers.indexOf(socket.id);
        if (index !== -1) {
            waitingUsers.splice(index, 1);
        }
    });
    // socket.on('moklo',({x,msg})=>{
    //     console.log('mila hua msg',msg,x);
    //     socket.broadcast.emit('malyo',{x,msg});
    // })

     socket.on('moklo',({x,msg})=>{
        console.log('mila hua msg',msg,x);

        // finding in which the room socket is there
        for (const room of socket.rooms) {
            if (room !== socket.id) {
                socket.to(room).emit('malyo',{x,msg});
            }
          } 
        // socket.to(socket.rooms).emit('malyo',{msg});
    })
    socket.on('ce',x=>{
        console.log(x,'wants to join computer')
        // socket.leave(socket.rooms);
        // leaving genral or any other room socket is in
        const ce = 'room-ce'
        for (const room of socket.rooms) {
            if (room !== socket.id) {
              if(room == ce){}else{
              socket.leave(room);
              io.to(room).emit('chhodgya',x);
              socket.join(ce);
            userRooms[socket.id] = ce;
              socket.emit('khalikaro');
              io.to(ce).emit('brdcastce',x);
            }}}
    });
    socket.on('genral',x=> {
        console.log(x,'wants to join genrall')
        const genral = 'room-genral'
        for (const room of socket.rooms) {
            if (room !== socket.id) {
              if(room == genral){}else{
              socket.leave(room);
              io.to(room).emit('chhodgya',x);
              socket.join(genral);
            userRooms[socket.id] = genral;
              socket.emit('khalikaro');
            io.to(genral).emit('brdcastg',x);
            }}};    
          });
    socket.on('coding',x=>{
        console.log(x,'wants to join coding')
        const coding = 'room-coding'
        for (const room of socket.rooms) {
            if (room !== socket.id) {
              if(room == coding){}else{
              socket.leave(room);
              io.to(room).emit('chhodgya',x);
              socket.join(coding);
            userRooms[socket.id] = coding;
              socket.emit('khalikaro');
              io.to(coding).emit('brdcastg',x);
            }}
          }
       
    });
    socket.on('it',x=>{
        console.log(x,'wants to join it')
        const it = 'room-it'
        for (const room of socket.rooms) {
            if (room !== socket.id) {
              if(room == it){}else{
              socket.leave(room);
              io.to(room).emit('chhodgya',x);
              socket.join(it);
            userRooms[socket.id] = it;
              socket.emit('khalikaro');
        io.to(it).emit('brdcastg',x);
            }}
          }
        
    });
    socket.on('chess',x=>{
        console.log(x,'wants to join genrall')
        const chess = 'room-chess'
        for (const room of socket.rooms) {
            if (room !== socket.id) {
              if( room == chess){}else{
              socket.leave(room);
              io.to(room).emit('chhodgya',x);
              socket.join(chess);
              userRooms[socket.id] = chess;
              socket.emit('khalikaro');
              io.to(chess).emit('brdcastg',x);
            }}
          }
       
    });
    socket.on('firstroom',x=>{
      const genral = 'room-genral';
        if (x == null){
            socket.emit('alertforname',x);}
        else{
      socket.join(genral);
     userRooms[socket.id] = genral;
      io.to(genral).emit('brdcastg',x);
        }});

});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log("server listening on 3000");
});
