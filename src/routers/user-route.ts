import express from 'express';
import {
  createUserController,
  deleteUserController,
  getUserController,
  loginUserController,
  updateUserController
} from '../controllers/user-controller';
import { authenticateToken, isAdmin, isOwner } from '../middlewares/auth-admin';
const router = express.Router();

router.post('/create-user', authenticateToken, isOwner, createUserController);
router.get('/get-users', authenticateToken, isAdmin, getUserController);
router.delete(
  '/delete-user/:id',
  authenticateToken,
  isOwner,
  deleteUserController
);
router.post('/login', loginUserController);
router.put(
  '/update-user/:id',
  authenticateToken,
  isOwner,
  updateUserController
);
// roter.put('/update-user/:id', () => {});
// roter.delete('/delete-user/:id', () => {});

export default router;
