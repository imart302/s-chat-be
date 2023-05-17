const { Router } = require("express");
const { validateJWT } = require("../middlewares/validateJWT.middleware");
const { changeProfileImage } = require("../controllers/profile.controller");
const multer  = require('multer');
const { validateFileExtension } = require("../middlewares/validateFileExtension");
const upload = multer({limits: {
  fileSize: 30000,
}});

const router = Router();

router.use(validateJWT);

router.put('/img', [upload.single('img'), validateFileExtension], changeProfileImage);

module.exports = router;