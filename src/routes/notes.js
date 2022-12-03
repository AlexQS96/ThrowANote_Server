const express = require('express');
const router = express.Router();
const controller = require('../controllers/notesController');

router.get('/', controller.home)
router.get('/list', controller.getNotes);
router.get('/private/:id', controller.getPrivateNote);
router.get('/:id', controller.getNote);
router.post('/add', controller.addNote);

module.exports = router;