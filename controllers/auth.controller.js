
const { response, request } = require('express');
const User = require('../models/user.model');
const bcrypt = require('bcrypt');
const { createJWT, verifyJWT } = require('../utils/jwt.utils');
const { v4: uuid } = require('uuid');

const createUser = async (req = request, res = response) => {
  const { email, password, username } = req.body;
  console.log('here');

  const u = await User.findOne({ email });

  console.log(u);
  if (u) {
    return res.status(400).json({
      message: 'email already used',
    });
  }

  const hash = bcrypt.hashSync(
    password,
    Number.parseInt(process.env.HASH_SALT)
  );

  const user = new User({
    email,
    password: hash,
    username,
  });

  await user.save();

  res.status(201).json({
    status: 'ok',
    user: {
      email,
      username,
    },
  });
};

const login = async (req = request, res = response) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    return res.status(404).json({
      message: 'Email or password incorrect',
    });
  }

  const match = bcrypt.compareSync(password, user.password);
  if (!match) {
    return res.status(404).json({
      message: 'Email or password incorrect',
    });
  }

  const token = await createJWT({
    username: user.username,
    id: user.id,
    email: user.email,
    createdAt: new Date().toISOString(),
    token_id: uuid(),
  });

  return res.status(200).json({
    status: 'ok',
    token,
    user: {
      username: user.username,
      email: user.email,
      id: user.id,
    },
  });
};

const refreshToken = async (req = request, res = response) => {
  const token = req.headers['x-token'];
  const v = await verifyJWT(token);

  if (!v) {
    return res.status(401).json({
      message: 'Invalid token',
    });
  }

  const newToken = await createJWT({
    username: v.username,
    id: v.id,
    email: v.email,
    createdAt: new Date().toISOString(),
    token_id: uuid(),
  });

  return res.status(200).json({
    status: 'ok',
    token: newToken,
    user: {
      username: v.username,
      email: v.email,
      id: v.id,
    },
  });
};

module.exports = {
  createUser,
  login,
  refreshToken,
};
