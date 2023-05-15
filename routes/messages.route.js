const { Router } = require('express');
const { validateJWT } = require('../middlewares/validateJWT.middleware');
const { queryMessages } = require('../controllers/messages.controller');
const { query } = require('express-validator');
const validateFields = require('../middlewares/validateFields.middleware');

const router = Router();

router.use(validateJWT);

//query messages http controller
router.get(
  '/',
  [query('contact', 'Sender not valid').isMongoId(), validateFields],
  queryMessages
);

module.exports = router;
