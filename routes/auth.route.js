const express = require('express');
const { body } = require('express-validator');
const validateFields = require('../middlewares/validateFields.middleware');
const {
  createUser,
  login,
  refreshToken,
  googleSingIn,
} = require('../controllers/auth.controller');
const limitUsers = require('../middlewares/limitUsers.middleware');

const router = express.Router();

//LOGIN HTTP CONTROLLER
router.post(
  '/',
  [
    body('email', 'email not valid').isEmail(),
    body('password', 'not a valid password').isLength({ min: 6, max: 40 }),
    validateFields,
  ],
  login
);

//CREATE USER HTTP CONTROLLER
router.post(
  '/create',
  [
    body('email', 'email not valid').isEmail(),
    body('username', 'username not valid').isLength({ min: 1, max: 25 }),
    body('password', 'not a valid password').isLength({ min: 6, max: 40 }),
    validateFields,
    limitUsers,
  ],
  createUser
);

//REFRESH TOKEN HTTP CONTROLLER
router.get('/', refreshToken);

router.post(
  '/google',
  [
    body('access_token', 'google token is required').isLength({ min: 6 }),
    validateFields,
  ],
  googleSingIn
);

router.delete('/:id', (req, res) => {});

module.exports = router;
