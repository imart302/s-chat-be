const { request, response } = require('express');
const User = require('../models/user.model');
const { Readable } = require('stream');
const cloudinary = require('cloudinary').v2;

cloudinary.config(process.env.CLOUDINARY_URL);

const changeProfileImage = async (req = request, res = response) => {
  try {
    const user = await User.findById(req.user.id);


    if(user.img){
      const imgName = user.img.split('/').pop();
      const imgPublicId = imgName.split('.')[0];
      cloudinary.uploader.destroy(`chatApp/${imgPublicId}`);
    }

    const uploadCloudinaryPs = new Promise((resolve, reject) => {
      const upload_cld = cloudinary.uploader.upload_stream({
        folder: 'chatApp'
      }, (err, result) => {
        if(err) reject(err);
        else resolve(result);
      });
  
      Readable.from(req.file.buffer).pipe(upload_cld);
    });

    const result = await uploadCloudinaryPs; 

    const picUrl = result.secure_url;
    
    if(user){
      user.img = picUrl;
      await user.save();
      return res.status(200).json({
        user: {
          username: user.username,
          email: user.email,
          id: user.id,
          img: user.img,
        }
      });
    } else {
      return res.status(404).json({
        message: 'user not found'
      });
    }

  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
};

module.exports = {
  changeProfileImage,
};
