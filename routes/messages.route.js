const { Router } = require('express');
const { validateJWT } = require('../middlewares/validateJWT.middleware');
const { queryMessages } = require('../controllers/messages.controller');
const { query } = require('express-validator');

const router = Router();

router.use(validateJWT);

//query messages http controller
router.get(
  '/',
  [query('sender', 'Sender not valid').isMongoId(), validateJWT],
  queryMessages
);

module.exports = router;
