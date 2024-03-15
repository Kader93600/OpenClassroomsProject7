const express = require('express');
const router = express.Router();

const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');

const booksController = require('../controllers/books');

router.post('/', auth, multer, booksController.createBook);
router.post('/:id/rating', auth, booksController.rateBook); // Ajout de cette route

router.put('/:id', auth, multer, booksController.updateBook);

router.get('/:id', booksController.getOneBook);
router.get('/',booksController.getAllBooks);
router.get('/bestrating', booksController.bestRating); // Ajout de cette route

router.delete('/:id', auth, booksController.deleteBook);

module.exports = router;