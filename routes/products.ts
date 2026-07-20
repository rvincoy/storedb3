import express from 'express';
import * as productsController from '../controllers/products';
import { requireJWT } from '../middleware/auth';

const router = express.Router();

// Get all products
router.get('/', /* #swagger.description = 'Gets all products from the database' */ productsController.getAll);

// Get a single product
router.get('/:id', /* #swagger.description = 'Gets a specific product by ID' */ productsController.getSingle);

// Create a new product
router.post('/', requireJWT, /*
    #swagger.description = 'Creates a new product'
    #swagger.security = [{ "bearerAuth": [] }]
*/ productsController.createProduct);

// Update a product
router.put('/:id', requireJWT, /*
    #swagger.description = 'Updates a specific product by ID'
    #swagger.security = [{ "bearerAuth": [] }]
*/ productsController.updateProduct);

// Delete a product
router.delete('/:id', requireJWT, /*
    #swagger.description = 'Deletes a specific product by ID'
    #swagger.security = [{ "bearerAuth": [] }]
*/ productsController.deleteProduct);

export default router;
