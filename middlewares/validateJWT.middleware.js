const {request, response} = require('express');
const { verifyJWT } = require('../utils/jwt.utils');

const validateJWT = async (req = request, res = response, next) => {

  const token = req.headers['x-token'];

  const v = await verifyJWT(token);

  if(!v){
    return res.status(401).json({
      message: 'Authentication error',
    });
  }

  req.user = v;
  next();
}

module.exports = {
  validateJWT,
}