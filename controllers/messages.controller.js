const { request, response } = require('express');
const { getMessageModel } = require('../models/message.model');
const {
  queryMessages: queryMessagesService,
} = require('../services/messages.services');

const queryMessages = async (req = request, res = response) => {

  try {
    const user = req.user;
    const { page = 0, pageSize = 10, contact } = req.query;

    const pageN = parseInt(page);
    const pageSizeN = parseInt(pageSize);

    const messageModel = getMessageModel(`messages_${user.id}`);

    const limit = pageSizeN;
    const offset = pageSizeN * pageN;
    const { messages, count } = await queryMessagesService(
      messageModel,
      limit,
      offset,
      contact,
      user.id
    );

    return res.json({
      pagination: {
        currentPage: pageN,
        nextPage: pageN === (Math.floor(count / pageSizeN) - 1) ? null : pageN + 1,
        prevPage: pageN === 0 ? null : pageN - 1,
        totalCount: count,
        pages: count % pageSizeN  === 0 ? Math.floor(count / pageSize) : Math.floor(count / pageSize) + 1,
        pageSize: pageSizeN
      },
      contact,
      messages,
    });
  } catch (error) {
    res.status(500).json({
      error,
    });
  }
};

module.exports = {
  queryMessages,
};
