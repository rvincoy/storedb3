import express from 'express';
import * as usersController from '../controllers/users';
import { requireJWT, requireRole } from '../middleware/auth';

const router = express.Router();

// All user-management routes are admin only
router.use(requireJWT, requireRole('admin'));

//Get all users
router.get('/', /*
    #swagger.description = 'Gets all users'
    #swagger.security = [{ "bearerAuth": [] }]
*/ usersController.getAll);

//Get user by ID
router.get('/:id', /*
    #swagger.description = 'Gets a specific user by ID'
    #swagger.security = [{ "bearerAuth": [] }]
*/ usersController.getSingle);

//Create user
router.post('/', /*
    #swagger.description = 'Creates a new user'
    #swagger.security = [{ "bearerAuth": [] }]
*/ usersController.createUser);

//Update user
router.put('/:id', /*
    #swagger.description = 'Updates a specific user by ID'
    #swagger.security = [{ "bearerAuth": [] }]
*/ usersController.updateUser);

//Promote/demote a user's role
router.patch('/:id/role', /*
    #swagger.description = "Promotes or demotes a user's role. Admin only."
    #swagger.security = [{ "bearerAuth": [] }]
*/ usersController.updateUserRole);

//Delete user
router.delete('/:id', /*
    #swagger.description = 'Deletes a specific user by ID'
    #swagger.security = [{ "bearerAuth": [] }]
*/ usersController.deleteUser);

export default router;
