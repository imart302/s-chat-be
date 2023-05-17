const { request, response } = require('express');
const Contact = require('../models/contact.model');
const User = require('../models/user.model');

const addContact = async (req = request, res = response) => {
  const { email } = req.body;

  try {
    const user = req.user;

    const userContact = await User.findOne({ email, deleted: false });

    if (!userContact) {
      return res.status(404).json({
        message: 'No user with this email',
      });
    }

    const prevContact = await Contact.findOne({
      email,
      userId: user.id
    });

    if (prevContact) {
      return res.status(400).json({
        message: 'Already exists',
      });
    }

    if (email === user.email) {
      return res.status(400).json({
        message: 'Same user',
      });
    }

    const contact = new Contact({
      email,
      userId: user.id,
      contactId: userContact.id,
      contactUsername: userContact.username,
    });

    const contactRepl = new Contact({
      email: user.email,
      userId: userContact.id,
      contactId: user.id,
      contactUsername: user.username,
    });

    await contact.save();
    await contactRepl.save();

    return res.status(201).json({
      contact: {
        email: contact.email,
        userId: contact.userId,
        contactId: contact.contactId,
        username: contact.contactUsername,
        id: contact.id
      },
    });
  } catch (error) {
    res.status(500).json({
      message: error,
    });
  }
};

const getContacts = async (req = request, res = response) => {
  try {
    const user = req.user;

    const contacts = await Contact.find({
      userId: user.id,
    });

    const emails = contacts.map(contact => contact.email);
    const userContacts = await User.find({email: [...emails]});

    return res.status(200).json({
      contacts: contacts.map(contact => ({
        email: contact.email,
        userId: contact.userId,
        contactId: contact.contactId,
        username: contact.contactUsername,
        id: contact.id,
        img: userContacts.find(uC => uC.email === contact.email)?.img,
      })),
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: error,
    });
  }
};

const deleteContact = async (req = request, res = response) => {
  try {
    const { id } = req.params;
    const user = req.user;

    const contact = await Contact.findById(id);
    if(!contact){
      return res.status(404).json({
        message: 'Contact not found'
      });
    }

    const op = await Contact.deleteMany({
      $or: [
        {
          email: contact.email,
          userId: user.id,
        },
        {
          email: user.email,
          userId: contact.contactId,
        }
      ]
    });

    return res.status(200).json({
      deleted: op.deletedCount,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: error,
    });
  }
};

module.exports = {
  addContact,
  getContacts,
  deleteContact,
};
