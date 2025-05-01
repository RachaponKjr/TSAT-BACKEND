import { Request, Response } from 'express';
import {
  createCustomerWork,
  getCustomerWork,
  getCustomerWorks
} from '../service/customer-work';

const createWorkController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const imageFile = req.file;
    const { title, content, tags, carModelId } = req.body;

    if (!imageFile || !title || !tags) {
      res.status(400).json({ message: 'กรุณากรอกข้อมูลให้ครบถ้วน' });
      return;
    }

    const parsedTags = JSON.parse(tags);
    const parsedContent = JSON.parse(content);
    const imageUrl = `/uploads/works/${imageFile.filename}`;

    const work = await createCustomerWork({
      input: {
        title,
        content: parsedContent,
        carModelId,
        tags: parsedTags
      },
      images: imageUrl
    });

    res.status(200).json({ status: 200, data: work });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
  }
};

const getWorksController = async (req: Request, res: Response) => {
  try {
    const data = await getCustomerWorks();
    res.status(200).json({ status: 200, ...data });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
  }
};

const getWorkController = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const works = await getCustomerWork({ id: id });
    res.status(200).json({ status: 200, data: works });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
  }
};

const deleteWorkController = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const works = await getCustomerWork({ id: id });
    res.status(200).json({ status: 200, data: works });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
  }
};

export {
  createWorkController,
  getWorkController,
  getWorksController,
  deleteWorkController
};
