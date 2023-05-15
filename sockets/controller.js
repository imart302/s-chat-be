const { Socket, Server } = require('socket.io');
const { verifyJWT } = require('../utils/jwt.utils');
const { getMessageModel } = require('../models/message.model');
const { createMessage } = require('../services/messages.services');
const JOI = require('joi');
const mongoose = require('mongoose');

const MessagePayload = JOI.object({
  text: JOI.string().min(1).max(50).required(),
  sentAt: JOI.string().isoDate().required(),
  sender: JOI.custom((value, helpers) =>
    mongoose.Types.ObjectId.isValid(value)
      ? value
      : helpers.error('Not a valid Mongo Id')
  ).required(),
  receiver: JOI.custom((value, helpers) =>
    mongoose.Types.ObjectId.isValid(value)
      ? value
      : helpers.error('Not a valid Mongo Id')
  ).required(),
});

const socketController = async (socket = new Socket(), io = new Server()) => {
  
  const token = socket.handshake.headers['x-token'];

  const user = await verifyJWT(token);

  if (!user) {
    
    socket.disconnect();
    return;
  }

  const messageUserModel = getMessageModel(`messages_${user.id}`);

  await socket.join(user.id);

  socket.on('sendMessage', async (payload) => {
    

    const { error } = MessagePayload.validate(payload);

    if(error){
      
      return socket.emit('messageErrorSchema', error.message);
    }

    const { text, sender, receiver, sentAt } = payload;

    const messageRecModel = getMessageModel(`messages_${receiver}`);
    const newMessage = await createMessage(messageUserModel, text, sender, receiver, new Date(sentAt));

    if (receiver !== sender) {
      createMessage(
        messageRecModel,
        text,
        sender,
        receiver,
        new Date(sentAt)
      );
    }
    
    const receiverRooms = io.sockets.adapter.rooms.get(payload.receiver);
    if (receiverRooms) {
      // SEND TO ALL SOCKETS
      io.to([...Array.from(receiverRooms), user.id]).emit('incomingMessage', newMessage);
    } else {
      //Not connected user send only to me
      
      socket.emit('incomingMessage', newMessage);
    }
  });

  socket.on('disconnect', () => {
    console.log(`${socket.id} leave`);
  });
};

module.exports = {
  socketController,
};
