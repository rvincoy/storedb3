const express = require('express');
const router = express.Router();
const returnsController = require('../controllers/returns');
const { requireJWT } = require('../middleware/auth');

// Get all returns
router.get('/', returnsController.getAll);

// Get a single return
router.get('/:id', returnsController.getSingle);

// Create a new return
router.post('/', requireJWT, returnsController.createReturn);

// Update a return
router.put('/:id', requireJWT, returnsController.updateReturn);

// Delete a return
router.delete('/:id', requireJWT, returnsController.deleteReturn);

module.exports = router;