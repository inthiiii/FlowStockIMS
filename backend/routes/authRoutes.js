import { Router } from 'express';
import { register, login, forgotPassword, resetPassword, listUsers, updateUser, deleteUser } from '../controllers/authController.js';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

// Basic user management routes (consider protecting with auth middleware later)
router.get('/users', listUsers);
router.put('/users/:id', updateUser);
router.delete('/users/:id', deleteUser);

export default router;


