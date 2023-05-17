const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const { socketController } = require('./sockets/controller');
const cors = require('cors');
const multer = require('multer');

const app = express();
app.use(cors({
  origin: process.env.CORS_ORIGIN,
}));
const server = http.createServer(app);
const io = new Server({
  serveClient: false,
  cors: {
    origin: process.env.CORS_ORIGIN,
  }
});

io.attach(server);

app.use(express.json());

app.get('/', (req, res) => {
  res.json({
    message: 'S-Chat BE',
  });
});

app.use('/api/auth', require('./routes/auth.route'));
app.use('/api/contact', require('./routes/contacts.route'));
app.use('/api/messages', require('./routes/messages.route'));
app.use('/api/profile', require('./routes/profile.route'));


const multerErrorHandling = (error, req, res, next) => {
  if(error instanceof multer.MulterError){
    return res.status(500).json({
      message: error.message
    })
  }
}

app.use(multerErrorHandling);

io.on('connection', (socket) => socketController(socket, io));

module.exports = {
  app,
  server,
};
