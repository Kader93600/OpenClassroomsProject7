const express = require('express');
const router = express.Router();

const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');

const booksCrtl = require('../controllers/books');

router.post('/', auth, multer, booksCrtl.createBook);
router.put('/:id', auth, multer, booksCrtl.modifyBook);
router.delete('/:id', auth, booksCrtl.deleteBook);
router.get('/:id', auth, booksCrtl.getOneBook);
router.get('/', auth,booksCrtl.getAllBooks);

module.exports = router;