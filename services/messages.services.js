
const createMessage = async (
  MessageModel,
  text,
  sender,
  receiver,
  sentAt = new Date()
) => {
  const message = new MessageModel({
    text,
    sender,
    receiver,
    sentAt: sentAt ?? new Date(),
  });

  await message.save();

  return message;
};

const queryMessages = async (MessageModel, limit, offset, sender, receiver) => {
  const messagesP = MessageModel.find({
    $or: [
      { sender, receiver },
      { sender: receiver, receiver: sender },
    ],
  })
    .sort({ sentAt: 'desc' })
    .skip(Number(offset))
    .limit(Number(limit));

  const countP = MessageModel.count({
    $or: [
      { sender, receiver },
      { sender: receiver, receiver: sender },
    ],
  });

  const [messages, count] = await Promise.all([messagesP, countP]);

  return { messages, count };
};

const countMessages = async (MessageModel, userId) => {
  const count = await MessageModel.count({ sender: userId });
  return count;
};

const deleteOlderMessage = async (MessageModel, userId) => {
  const messages = await MessageModel.find({ sender: userId })
    .sort({ sentAt: 'desc' })
    .limit(1);

  if (messages) {
    await MessageModel.deleteOne({ id: messages[0].id });
  }
};

module.exports = {
  createMessage,
  queryMessages,
  countMessages,
  deleteOlderMessage,
};
