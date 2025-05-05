import express from 'express';
import { createBug, getBugs, getBugById, updateBug, takeBug, deleteBug } from '../controllers/bugController.js';
import { protect } from '../midlleware/authMiddleware.js';
import validateIdMongo from '../utils/validateIdMongo.js';

const bugRouter = express.Router();

bugRouter.route('/').post(protect, createBug).get(protect, getBugs);
bugRouter.route('/:id')
                    .put(protect, validateIdMongo, updateBug)
                    .delete(protect, validateIdMongo, deleteBug)
                    .get(protect, validateIdMongo, getBugById);
bugRouter.route('/take/:id').put(protect, validateIdMongo, takeBug);

export default bugRouter;
// This code defines the routes for managing bugs in a bug tracking application. It uses Express.js to create a router that handles HTTP requests
// for creating, retrieving, updating, and deleting bugs. The routes are protected by authentication middleware to ensure that only authorized 
// users can access them. The controller functions for handling the actual logic of each route are imported from a separate file.