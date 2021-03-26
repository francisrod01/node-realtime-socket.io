const app = require('express')();
const server = require('http').Server(app);
const io = require('socket.io')(server);

const port = 3000;

server.listen(port, () => console.log(`Server is running on port ${port}`));


app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

app.get('/javascript', (req, res) => {
  res.sendFile(__dirname + '/public/javascript.html');
});

const tech = io.of('/tech');

// listening connection from the client.
tech.on('connection', (socket) => {
  socket.on('join', (data) => {
    socket.join(data.room);
    tech.in(data.room).emit('message', `New user joined ${data.room} room!`);
  });

  socket.on('message', (data) => {
    console.log(`message: ${data.msg}`);

    // emit the message back to user screen.
    tech.in(data.room).emit('message', data.msg);
  });

  socket.on('disconnect', () => {
    console.log('user disconnected.');

    tech.emit('message', 'user disconnected.');
  });
});
