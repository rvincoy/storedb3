import express from 'express';
import * as ledgersController from '../controllers/ledgers';
import { requireJWT } from '../middleware/auth';

const router = express.Router();

router.get('/', /* #swagger.description = 'Gets all ledgers from the database' */ ledgersController.getAll);
router.get('/:id', /* #swagger.description = 'Gets a specific ledger entry by ID' */ ledgersController.getSingle);
router.post('/', requireJWT, /*
    #swagger.description = 'Creates a new ledger entry'
    #swagger.security = [{ "bearerAuth": [] }]
*/ ledgersController.createLedger);
router.put('/:id', requireJWT, /*
    #swagger.description = 'Updates a specific ledger entry by ID'
    #swagger.security = [{ "bearerAuth": [] }]
*/ ledgersController.updateLedger);
router.delete('/:id', requireJWT, /*
    #swagger.description = 'Deletes a specific ledger entry by ID'
    #swagger.security = [{ "bearerAuth": [] }]
*/ ledgersController.deleteLedger);

export default router;
