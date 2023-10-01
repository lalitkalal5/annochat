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
    res.sendFile(__dirname+'/contacts.html')
});
app.get('/vc',(req,res)=>{
    res.sendFile(__dirname+'/public/vc2.html')
});
const waitingUsers = [];
let roomCounter = 1;
totaljanta =[];
usersingrp=[];
const users = {};
const userRooms = {};
const waitingUsersvc = [];
let roomCountervc = 1000;
const usergrp ={};


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
        if (socket.id != partnerSocketId){

        socket.join(roomName);
        // partnerSocketId.join(roomName);
        const partnerSocket = io.sockets.sockets.get(partnerSocketId);
        partnerSocket.join(roomName);
        socket.room = roomName;
        partnerSocket.room = roomName;
        console.log('user joined in a room',socket.id,partnerSocket.id);
        console.log(roomName);
        console.log(waitingUsers);
        socket.to(socket.room).emit('waitbf',roomName);
        io.to(socket.room).emit('partnerjoined', roomName);

        roomCounter++;}}else{
        waitingUsers.push(socket.id);
        socket.emit('waitmf',socket.id);
        console.log('user joined in waiting list',socket.id);
        console.log(waitingUsers);
        }
});
     socket.on('typing', (isTyping) => {
        // Broadcast the 'typing' event to all other connected clients except the sender
        socket.to(socket.room).emit('typing', isTyping);
      });
    socket.on('sendusername',data=>{
         usersingrp.push(data);
        socket.emit('jantaingrp',usersingrp.length);
    });
socket.on('addlistvc',(data)=>{
    console.log(data);
    if (waitingUsersvc.length > 0 ) {
        const partnerSocketId = waitingUsersvc.pop();
        const roomName = `room-${roomCountervc}`;

        socket.join(roomName);
        const partnerSocket = io.sockets.sockets.get(partnerSocketId);
        partnerSocket.join(roomName);
        socket.room = roomName;
        partnerSocket.room = roomName;
        console.log('user joined in vc a room',socket.id,partnerSocket.id);
        console.log(waitingUsersvc);
        socket.to(socket.room).emit('abc123',roomName);
        io.to(socket.room).emit('partnerjoined', roomName);

        roomCounter++;}
    else{
        waitingUsersvc.push(socket.id);
        console.log('user joined in waiting vc list',socket.id);
        console.log(waitingUsersvc);
        }
});
socket.on('ice-candidate',(candidate)=>{
    socket.to(socket.room).emit('new-ice-candidate',candidate)
});

  socket.on('offer', (offer)=>{
    // console.log(data)
    socket.to(socket.room).emit('rcvoffer',offer)});
       
socket.on('answer',(answer)=>{
    console.log(answer);
    socket.to(socket.room).emit('rcvanswer',answer);
});
socket.on('disconnectfromvc',(data)=>{
// peerConnection.close();
// socket.on('addlistvc',(data));
socket.to(socket.room).emit('left');
socket.leave(socket.room);
console.log("room choota")
})
socket.on('leave',()=>{
    socket.leave(socket.room);
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
        waitingUsers.pop(socket.id);
        // users.pop(x);

        io.to(socket.room).emit('userleft');
        socket.leave(socket.room);
      const disconnectedRoom = userRooms[socket.id];
        // console.log(disconnectedRoom);
        if (disconnectedRoom){
        const disconnectedUsername = users[socket.id];
            const usergya = usergrp[socket.id];
        // console.log(disconnectedUsername);
        socket.to(disconnectedRoom).emit('chhodgya',usergya);
            delete userRooms[socket.id];
        }
        totaljanta.pop(socket.id);
        usersingrp.pop(socket.id);
        // const partnerSocket = io.sockets.sockets.get(partnerSocketId);
        // partnerSocket.leave(socket.room);
        // partnerSocket.push(waitingUsers);
        console.log(waitingUsers);
        const index = waitingUsers.indexOf(socket.id);
        if (index !== -1) {
            waitingUsers.splice(index, 1);};
          const index2 = waitingUsersvc.indexOf(socket.id);
        if (index2 !== -1) {
            waitingUsersvc.splice(index2, 1);
        };
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
              io.to(coding).emit('brdcastcoding',x);
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
        io.to(it).emit('brdcastit',x);
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
              io.to(chess).emit('brdcastchess',x);
            }}
          }
       
    });
    socket.on('firstroom',x=>{
      const genral = 'room-genral';
        if (x == null){
            socket.emit('alertforname',x);}
        else{
      socket.join(genral);
    usergrp[socket.id]= x;
     userRooms[socket.id] = genral;
      io.to(genral).emit('brdcastg',x);
        }});

        // socket.on('xxx',(data)=>{
        //   socket.to(socket.room).emit('userleft');
        //   socket.emit('youleftchat',socket.id);
        //   kamra = socket.room;
        //   const room = io.sockets.adapter.rooms[kamra];
        //   room.forEach(socketId => {
        //     const socket = io.sockets.sockets[socketId];
        //     if (socket) {
        //       socket.leave(kamra);
        //     }    
        // })
// });
socket.on('xxx', (data) => {
  io.to(socket.room).emit('userleft');
  io.to(socket.room).emit('idbhejo');
  // socket.leave(socket.room);
});
socket.on('idlelo',(data)=>{
  data= socket
  socket.leave(socket.room);
})
socket.on('baharnikalo',(data)=>{
  waitingUsers.pop(data);
  socket.emit('totaljanta',totaljanta.length);
  // console.log(waitingUsers);
  console.log('jay shree narayan');
})
});


const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log("server listening on 3000");
});
