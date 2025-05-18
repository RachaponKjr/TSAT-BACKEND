import { Request, Response } from 'express';
import {
  createCatagoryService,
  getCatagoryService
} from '../service/catagory-service';

const postCatagory = async (req: Request, res: Response) => {
  try {
    const { title } = req.body;
    const catagoryService = await createCatagoryService({ title });
    res.status(201).json(catagoryService);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
const getCatagory = async (req, res) => {
  try {
    const catagoryService = await getCatagoryService();
    res.status(200).json(catagoryService);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export { postCatagory, getCatagory };
