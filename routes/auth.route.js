const express = require('express');
const { body } = require('express-validator');
const validateFields = require('../middlewares/validateFields.middleware');
const { createUser, login, refreshToken } = require('../controllers/auth.controller');
const limitUsers = require('../middlewares/limitUsers.middleware');

const router = express.Router();

//LOGIN HTTP CONTROLLER
router.post(
  '/',
  [
    body('email', 'email not valid').isEmail(),
    body('password', 'not a valid password').isLength({ min: 6 }),
    validateFields,
  ],
  login
);

//CREATE USER HTTP CONTROLLER
router.post(
  '/create',
  [
    body('email', 'email not valid').isEmail(),
    body('username', 'username not valid').isLength({ min: 6 }),
    body('password', 'not a valid password').isLength({ min: 6 }),
    validateFields,
    limitUsers,
  ],
  createUser
);

//REFRESH TOKEN HTTP CONTROLLER
router.get('/', refreshToken);

router.post('/google', (req, res) => {});

router.delete('/:id', (req, res) => {});

module.exports = router;
