import express from 'express';
import { register, login, getProfile, logout } from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/register', register); //http://localhost:8000/api/auth/register
router.post('/login', login);//http://localhost:3000/api/auth/login
router.get('/profile', protect, getProfile);//http://localhost:3000/api/auth/profile
router.post('/logout', logout);//http://localhost:3000/api/auth/logout
export default router;
