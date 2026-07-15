const express = require('express');
const router = express.Router();
const returnsController = require('../controllers/returns');

// Get all returns
router.get('/', returnsController.getAll);

// Get a single return
router.get('/:id', returnsController.getSingle);

// Create a new return
router.post('/', returnsController.createReturn);

// Update a return
router.put('/:id', returnsController.updateReturn);

// Delete a return
router.delete('/:id', returnsController.deleteReturn);

module.exports = router;