/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from 'axios';
import { Request, Response } from 'express';
import { triggerApifyAndGetData } from '../libs/apifyService';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const getReviewController = async (req: Request, res: Response) => {
  try {
    console.log('Fetching and Syncing reviews with original timestamps...');

    // 1. ดึงข้อมูลจาก TSAT
    const tsatResponse = await axios.get('https://tsatdata.com/api/reviews');
    const tsatReviews = tsatResponse.data.data;

    // 2. ดึงข้อมูลจาก Google (ผ่าน Apify)
    const googleUrl =
      'https://www.google.com/maps/place/Top+Service+Auto+Technic+(TSAT)+-+ศูนย์ซ่อม+Porsche+รัชดาภิเษก%2F@13.8021688,100.5723953,903m/data=!3m2!1e3!4b1!4m6!3m5!1s0x30e29d56af799657:0xf27282e06a2dc51d!8m2!3d13.8021688!4d100.5723953!16s%2Fg%2F11h94wqy9f?entry=ttu&g_ep=EgoyMDI2MDUwNi4wIKXMDSoASAFQAw%3D%3D';
    const googleReviewsRaw = await triggerApifyAndGetData(googleUrl);

    // 3. จัดการข้อมูล TSAT
    const tsatData = tsatReviews.map((item: any) => ({
      source: 'TSAT',
      user: item.customer_name,
      comment: item.comment,
      user_image: item.image,
      rating: item.responses.rating,
      // ใช้เวลาจริงจาก API ต้นทาง
      createdAt: new Date(item.created_at)
    }));

    // 4. จัดการข้อมูล Google
    const googleData = (googleReviewsRaw || []).map((item: any) => ({
      source: 'Google',
      user: item.name,
      comment: item.text,
      user_image: item.profilePhotoUrl,
      rating: parseInt(item.stars) || 0,
      // ใช้เวลาจริงที่ Google ระบุ (Apify มักส่งมาใน PublishedAtDate)
      createdAt: item.publishedAtDate
        ? new Date(item.publishedAtDate)
        : new Date()
    }));

    const allReviews = [...tsatData, ...googleData];

    // 5. บันทึกลงฐานข้อมูล (ใช้ Loop เพื่อเช็คและข้ามตัวที่ซ้ำ)
    for (const review of allReviews) {
      // ตรวจสอบว่ามีรีวิวนี้อยู่แล้วหรือยัง (เช็คจาก user และ comment พร้อมกัน)
      const existing = await prisma.review.findFirst({
        where: {
          user: review.user,
          comment: review.comment,
          source: review.source
        }
      });

      if (!existing) {
        await prisma.review.create({
          data: review
        });
      }
    }

    // 6. ดึงข้อมูลทั้งหมดจาก DB เพื่อส่งกลับ (เรียงตามเวลาจริงที่ดึงมา)
    const finalData = await prisma.review.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    });

    res.status(200).json({
      status: 200,
      count: finalData.length,
      data: finalData
    });
  } catch (error: any) {
    console.error('Database Sync Error:', error.message);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

const getReviewAllController = async (req: Request, res: Response) => {
  try {
    // ดึงข้อมูลจากฐานข้อมูลที่ Cron Job เตรียมไว้ให้แล้ว
    const reviews = await prisma.review.findMany({
      where: { showActive: true },
      orderBy: { createdAt: 'desc' } // เรียงตามเวลาจริงที่ดึงมา
    });

    res.status(200).json({
      status: 200,
      count: reviews.length,
      data: reviews
    });
  } catch (error: any) {
    res.status(500).json({ message: 'Error', error: error.message });
  }
};

const updateShowReviewController = async (req: Request, res: Response) => {
  try {
    const { id, showActive } = req.body;
    const updatedReview = await prisma.review.update({
      where: { id },
      data: { showActive }
    });
    res.status(200).json({
      status: 200,
      data: updatedReview
    });
  } catch (error: any) {
    res.status(500).json({ message: 'Error', error: error.message });
  }
};

export {
  getReviewController,
  getReviewAllController,
  updateShowReviewController
};
