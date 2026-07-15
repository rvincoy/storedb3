const express = require('express');
const router = express.Router();
const usersController = require('../controllers/users');
const { requireJWT, requireRole } = require('../middleware/auth');

// All user-management routes are admin only
router.use(requireJWT, requireRole('admin'));

//Get all users
router.get('/', usersController.getAll);

//Get user by ID
router.get('/:id', usersController.getSingle);

//Create user
router.post('/', usersController.createUser);

//Update user
router.put('/:id', usersController.updateUser);

//Promote/demote a user's role
router.patch('/:id/role', usersController.updateUserRole);

//Delete user
router.delete('/:id', usersController.deleteUser);

module.exports = router;