const express = require('express');
const router = express.Router();
const ledgersController = require('../controllers/ledgers');
const { requireJWT } = require('../middleware/auth');

router.get('/', ledgersController.getAll);
router.get('/:id', ledgersController.getSingle);
router.post('/', requireJWT, ledgersController.createLedger);
router.put('/:id', requireJWT, ledgersController.updateLedger);
router.delete('/:id', requireJWT, ledgersController.deleteLedger);

module.exports = router;