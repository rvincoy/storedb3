import express from 'express';
import * as ledgersController from '../controllers/ledgers';

const router = express.Router();

router.get('/', ledgersController.getAll);
router.get('/:id', ledgersController.getSingle);
router.post('/', ledgersController.createLedger);
router.put('/:id', ledgersController.updateLedger);
router.delete('/:id', ledgersController.deleteLedger);

export = router;