const express = require('express');

const attachemntsCtrl = require('../controllers/attachment');

const router = express.Router();

router.get('/', attachemntsCtrl.getAttachments);
router.post('/add', attachemntsCtrl.addAttachments);
router.get('/:id', attachemntsCtrl.getAttachment);
router.post('/delete/:id', attachemntsCtrl.deleteAttachment);

module.exports = router;