import express from 'express';
import * as returnsController from '../controllers/returns';
import { requireJWT } from '../middleware/auth';

const router = express.Router();

// Get all returns
router.get('/', /* #swagger.description = 'Gets all returns from the database' */ returnsController.getAll);

// Get a single return
router.get('/:id', /* #swagger.description = 'Gets a specific return by ID' */ returnsController.getSingle);

// Create a new return
router.post('/', requireJWT, /*
    #swagger.description = 'Creates a new return'
    #swagger.security = [{ "bearerAuth": [] }]
*/ returnsController.createReturn);

// Update a return
router.put('/:id', requireJWT, /*
    #swagger.description = 'Updates a specific return by ID'
    #swagger.security = [{ "bearerAuth": [] }]
*/ returnsController.updateReturn);

// Delete a return
router.delete('/:id', requireJWT, /*
    #swagger.description = 'Deletes a specific return by ID'
    #swagger.security = [{ "bearerAuth": [] }]
*/ returnsController.deleteReturn);

export default router;
