const express = require('express');
const router = express.Router();

const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');

const stuffCrtl = require('../controllers/stuff');

router.post('/', auth, multer, stuffCrtl.createThing);
router.put('/:id', auth, multer, stuffCrtl.modifyThing);
router.delete('/:id', auth, stuffCrtl.deleteThing);
router.get('/:id', auth, stuffCrtl.getOneThing);
router.get('/', auth,stuffCrtl.getAllThings);

module.exports = router;