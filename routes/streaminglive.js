const express = require('express');
const socketIO = require('socket.io');

const streamLiveRoutes = express.Router()

const io = socketIO(server);

app.use(express.static('public')); // Serve static files from the 'public' directory

io.on('connection', socket => {
  console.log('User connected:', socket.id);

  socket.on('offer', offer => {
    // Broadcast the offer to all other connected clients
    socket.broadcast.emit('offer', offer);
  });

  socket.on('answer', answer => {
    // Broadcast the answer to all other connected clients
    socket.broadcast.emit('answer', answer);
  });

  socket.on('ice-candidate', candidate => {
    // Broadcast the ICE candidate to all other connected clients
    socket.broadcast.emit('ice-candidate', candidate);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
