

const checkFileExtensions = (ext, validExts = ['jpg', 'png', 'jpeg', 'gif']) => {
  return (validExts.includes(ext.toLowerCase()))
}


module.exports = {
  checkFileExtensions,
}