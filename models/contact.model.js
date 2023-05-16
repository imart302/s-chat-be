const { default: mongoose } = require("mongoose");


const ContactSchema = mongoose.Schema({

  email: {
    type: String,
    required: true,
  },

  userId: {
    type: mongoose.Types.ObjectId,
    required: true,
  },

  contactId: {
    type: mongoose.Types.ObjectId,
    required: true,
  },

  contactUsername: {
    type: String,
    required: true,
  },

  accepted: {
    type: Boolean,
    default: false,
  }

});

const Contact = mongoose.model('contact', ContactSchema);

module.exports = Contact;