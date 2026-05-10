import express from 'express';
import {
  createUserController,
  deleteUserController,
  getUserController,
  loginUserController,
  updateUserController
} from '../controllers/user-controller';
import {
  authenticateToken,
  isAdmin,
  isOwner,
  isUser
} from '../middlewares/auth-admin';

const router = express.Router();

router.post('/create-user', authenticateToken, isUser, createUserController);
router.get('/get-users', authenticateToken, isUser, getUserController);
router.delete(
  '/delete-user/:id',
  authenticateToken,
  isAdmin,
  deleteUserController
);
router.post('/login', loginUserController);
router.put(
  '/update-user/:id',
  authenticateToken,
  isAdmin,
  updateUserController
);
// roter.put('/update-user/:id', () => {});
// roter.delete('/delete-user/:id', () => {});

export default router;
