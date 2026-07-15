const express = require('express');
const router = express.Router();
const productsController = require('../controllers/products');
const { requireJWT } = require('../middleware/auth');

// Get all products
router.get('/', /* #swagger.description = 'Gets all products from the database' */ productsController.getAll)

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

module.exports = router;