import { PrismaClient } from '@prisma/client';
import express, { Request, Response } from 'express';

const router = express.Router();
const db = new PrismaClient();
router.get('/get-seo', async (req: Request, res: Response) => {
  try {
    const getRes = await db.seo.findFirst();
    res.status(200).json({ ...getRes });
    return;
  } catch (err) {
    res.status(500).json({ message: 'Server Error!' });
    return;
  }
});
router.patch('/update-seo/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    console.log(id);
    console.log(req.body);
    const updateRes = await db.seo.update({
      where: {
        id
      },
      data: req.body
    });
    res.status(200).json({
      data: { ...updateRes }
    });
    return;
  } catch (err) {
    res.status(500).json({ message: 'Server Error!', err });
    return;
  }
});

export default router;
