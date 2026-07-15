const express = require('express');
const router = express.Router();
const ledgersController = require('../controllers/ledgers');

router.get('/', ledgersController.getAll);
router.get('/:id', ledgersController.getSingle);
router.post('/', ledgersController.createLedger);
router.put('/:id', ledgersController.updateLedger);
router.delete('/:id', ledgersController.deleteLedger);

module.exports = router;