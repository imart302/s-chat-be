const { request, response } = require('express');
const { checkFileExtensions } = require('../utils/checkFileExtensions.utls');

const validateFileExtension = (req = request, res = response, next) => {
  const file = req.file;

  if (!file) {
    return res.status(400).json({
      message: 'No file provided',
    });
  }

  const fileName = file.originalname;
  const extension = fileName.split('.').pop();
  if (!checkFileExtensions(extension)) {
    return res.status(400).json({
      message: 'Not a valid image format',
    });
  }

  next();
};

module.exports = {
  validateFileExtension,
};
