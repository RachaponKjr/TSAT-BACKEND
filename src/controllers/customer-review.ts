import { Request, Response } from 'express';
import {
  CreateReviewService,
  DeleteReviewService,
  GetReviewByIdService,
  GetReviewService
} from '../service/customer-review';
import fs from 'fs';
import path from 'path';

const CustomerReviewController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { customerName, review, carModelId, carSubModelId } = req.body;
    const image = req.file as Express.Multer.File;
    if (!customerName || !review || !carModelId || !carSubModelId || !image) {
      res.status(400).json({ status: 400, message: 'กรุณากรอกข้อมูลให้ครบ' });
      return;
    }

    const imagePath = `/uploads/reviews/${image.filename}`;

    const createdReview = await CreateReviewService({
      data: {
        customerName,
        review,
        carModelId,
        carSubModelId
      },
      image: imagePath
    });

    res.status(200).json({
      status: 200,
      message: 'สร้างรีวิวสำเร็จ',
      data: createdReview
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ status: 500, message: 'Server Error', error });
  }
};

const getReviewController = async (req: Request, res: Response) => {
  try {
    const reviews = await GetReviewService();
    res.status(200).json({ status: 200, reviews });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
  }
};

const getReviewByIdController = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const review = await GetReviewByIdService(id);
    res.status(200).json({ status: 200, data: review });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
  }
};

const deleteReviewController = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;

    // สมมุติว่า DeleteReviewService return path รูปด้วย เช่น { success: true, imagePath: "/uploads/image1.jpg" }
    const result = await DeleteReviewService(id);

    if (result?.image) {
      const imagePath = path.join(__dirname, '../..', result.image); // ปรับ path ให้ตรงกับโฟลเดอร์จริง
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath); // หรือใช้ await fs.promises.unlink(imagePath)
      }
    }

    res.status(200).json({ status: 200, data: result });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
  }
};

export {
  CustomerReviewController,
  getReviewController,
  getReviewByIdController,
  deleteReviewController
};
