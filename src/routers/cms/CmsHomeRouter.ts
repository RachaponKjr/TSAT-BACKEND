import express from 'express';
import {
  getCMSHome,
  updateCMSHome
} from '../../controllers/cms/CmsHomeController';

const router = express.Router();

router.get('/', getCMSHome);
router.put('/update', updateCMSHome);

export default router;
