import { Router } from 'express';
import {
  createItemsController,
  deleteItemController,
  getItemByIdController,
  getItemListController,
  updateItemController
} from '../controllers/items.controller';
import { authenticateToken, isMechanic } from '../middlewares/auth-admin';

const route = Router();

route.post(
  '/create-items',
  authenticateToken,
  isMechanic,
  createItemsController
);
route.get(
  '/get-item-list',
  authenticateToken,
  isMechanic,
  getItemListController
);
route.get('/getItem/:id', authenticateToken, isMechanic, getItemByIdController);
route.patch(
  '/update-item/:id',
  authenticateToken,
  isMechanic,
  updateItemController
);
route.delete(
  '/delete-item/:id',
  authenticateToken,
  isMechanic,
  deleteItemController
);

export default route;
