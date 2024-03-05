const express = require('express');
const router = express.Router();

const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');

const booksCrtl = require('../controllers/books');

router.post('/', auth, multer, booksCrtl.createBook);

router.post('/:id/rating', auth, booksCrtl.rateBook); // Ajout de cette route

router.put('/:id', auth, multer, booksCrtl.modifyBook);
router.get('/:id', auth, booksCrtl.getOneBook);
router.get('/', auth,booksCrtl.getAllBooks);

router.get('/bestrating', booksCrtl.BestRating); // Ajout de cette route

router.delete('/:id', auth, booksCrtl.deleteBook);

module.exports = router;