const mongoose = require('mongoose');


const userSchema = mongoose.Schema({
  email: {
    type: String,
    required: true
  },
  username: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  google: {
    type: Boolean,
    default: false
  },
  deleted: {
    type: Boolean,
    default: false
  },
  img: {
    type: String
  }  

});

const User = mongoose.model('user', userSchema);

module.exports = User;