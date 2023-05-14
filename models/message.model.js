const mongoose = require('mongoose');

const messageSchema = mongoose.Schema({

  text: {
    type: String,
    required: true,
  },
  sentAt: {
    type: Date
  },
  sender: {
    type: mongoose.Types.ObjectId,
    required: true,
  },
  receiver: {
    type: mongoose.Types.ObjectId,
    required: true,
  }

}, {
  toJSON: {
    transform: function (doc, ret) {
      delete ret.__v;
      ret.id = ret._id;
      delete ret._id;
    }
  } 
});


const getMessageModel = (docName) => {
  const Message = mongoose.model(docName, messageSchema);
  return Message
}

module.exports = {
  getMessageModel
};