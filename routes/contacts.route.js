const express = require('express');
const {
  addContact,
  getContacts,
  deleteContact,
} = require('../controllers/contacts.controller');
const { body } = require('express-validator');
const validateFields = require('../middlewares/validateFields.middleware');
const { validateJWT } = require('../middlewares/validateJWT.middleware');

const router = express.Router();

router.use(validateJWT);

//Add a new contact
router.post(
  '/',
  [body('email', 'email is required').isEmail(), validateFields],
  addContact
);

//Get contacts
router.get('/', getContacts);

//Delete contacts
router.delete(
  '/',
  [body('email', 'email is required').isEmail(), validateFields],
  deleteContact
);


module.exports = router;