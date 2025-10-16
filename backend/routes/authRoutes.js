import { Router } from 'express';
import { register, login, forgotPassword, resetPassword, listUsers, updateUser, deleteUser, changeCredentials, me } from '../controllers/authController.js';
import { protect } from '../middleware/auth.js';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
router.get('/me', protect, me);
router.post('/change-credentials', protect, changeCredentials);

// Basic user management routes (consider protecting with auth middleware later)
router.get('/users', listUsers);
router.put('/users/:id', updateUser);
router.delete('/users/:id', deleteUser);

export default router;


