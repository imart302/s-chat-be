
const jwt = require('jsonwebtoken');


const createJWT = async (props) => {

  const token = jwt.sign({
    ...props
  }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXP
  });

  return token;
}

const verifyJWT = async (token) => {

  try{
    const v = jwt.verify(token, process.env.JWT_SECRET);
    return v;
  } catch( error ) {
    console.log('ERROR: ', error);
    return null;
  }
}

module.exports = {
  createJWT,
  verifyJWT,
}