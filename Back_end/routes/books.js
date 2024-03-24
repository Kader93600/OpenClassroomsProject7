const express = require('express');
const router = express.Router();

const auth = require('../middleware/auth');
const { multerUpload, convertAndSaveImage } = require('../middleware/multer-config');

const booksController = require('../controllers/books');

router.post('/', auth, multerUpload, convertAndSaveImage, booksController.createBook);
router.put('/:id', auth, multerUpload, convertAndSaveImage, booksController.updateBook);

router.get('/bestrating', booksController.bestRating);
router.post('/:id/rating', auth, booksController.rateBook);
router.get('/:id', booksController.getOneBook);
router.get('/', booksController.getAllBooks);
router.delete('/:id', auth, booksController.deleteBook);

module.exports = router;