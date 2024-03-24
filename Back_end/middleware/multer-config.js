const multer = require('multer');
const sharp = require('sharp');
const storage = multer.memoryStorage();

const multerUpload = multer({ storage: storage }).single('image');

// Convertir et sauvegarder l'image
const convertAndSaveImage = (req, res, next) => {
  if (!req.file) return next(); 
  const filename = req.file.originalname.split(' ').join('_')+ Date.now() + '.webp'; 

  sharp(req.file.buffer)
    .webp({ quality: 80 }) 
    .toFile(`images/${filename}`, (err) => {
      if (err) return next(err);
      req.file.filename = filename;
      next();
    });
};

module.exports = { multerUpload, convertAndSaveImage };