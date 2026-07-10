const express = require('express');
const router = express.Router();
const productsController = require('../controllers/products');
const { requireJWT } = require('../middleware/auth');

// Get all products
router.get('/', productsController.getAll)

// Get a single product
router.get('/:id', productsController.getSingle);

// Create a new product
router.post('/', requireJWT, productsController.createProduct);

// Update a product
router.put('/:id', requireJWT, productsController.updateProduct);

// Delete a product
router.delete('/:id', requireJWT, productsController.deleteProduct);

module.exports = router;