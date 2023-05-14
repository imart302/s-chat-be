const { request, response } = require('express');
const User = require('../models/user.model');

const limitUsers = async (req = request, res = response, next) => {

  const userCount = await User.count();

  if(userCount > process.env.LIMIT_USERS ?? 40){
    return res.status(400).json({
      message: 'Cannot create more users'
    });
  }

  next();
};

module.exports = limitUsers;
