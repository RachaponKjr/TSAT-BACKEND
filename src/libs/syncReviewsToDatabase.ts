/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from 'axios';
import { PrismaClient } from '@prisma/client';
import { triggerApifyAndGetData } from './apifyService';

const prisma = new PrismaClient();

export const syncReviewsToDatabase = async () => {
  try {
    console.log('--- Starting Weekly Review Sync ---');

    // 1. ดึงข้อมูลจาก TSAT
    const tsatResponse = await axios.get('https://tsatdata.com/api/reviews');
    const tsatReviews = tsatResponse.data.data;

    // 2. ดึงข้อมูลจาก Google (Apify)
    const googleUrl =
      'https://www.google.com/maps/place/Top+Service+Auto+Technic+(TSAT)+-+ศูนย์ซ่อม+Porsche+รัชดาภิเษก%2F@13.8021688,100.5723953,903m/data=!3m2!1e3!4b1!4m6!3m5!1s0x30e29d56af799657:0xf27282e06a2dc51d!8m2!3d13.8021688!4d100.5723953!16s%2Fg%2F11h94wqy9f?entry=ttu&g_ep=EgoyMDI2MDUwNi4wIKXMDSoASAFQAw%3D%3D';
    const googleReviewsRaw = await triggerApifyAndGetData(googleUrl);

    // 3. เตรียมข้อมูล
    const allData = [
      ...tsatReviews.map((item: any) => ({
        source: 'TSAT',
        user: item.customer_name,
        comment: item.comment,
        user_image: item.image,
        rating: item.responses.rating,
        createdAt: new Date(item.created_at) // ใช้เวลาจริง
      })),
      ...(googleReviewsRaw || []).map((item: any) => ({
        source: 'Google',
        user: item.name,
        comment: item.text,
        user_image: item.profilePhotoUrl,
        rating: parseInt(item.stars) || 0,
        createdAt: item.publishedAtDate
          ? new Date(item.publishedAtDate)
          : new Date() // ใช้เวลาจริง
      }))
    ];

    // 4. บันทึกแบบ Upsert (ถ้ามีแล้วให้อัปเดต ถ้าไม่มีให้สร้างใหม่)
    let newItemsCount = 0;
    for (const review of allData) {
      // ใช้เงื่อนไข: แหล่งที่มา + ชื่อผู้ใช้ + ข้อความ เป็นตัวระบุตัวตน (ป้องกันซ้ำ)
      const existing = await prisma.review.findFirst({
        where: {
          user: review.user,
          comment: review.comment,
          source: review.source
        }
      });

      if (!existing) {
        await prisma.review.create({ data: review });
        newItemsCount++;
      }
    }

    console.log(`--- Sync Completed: Added ${newItemsCount} new reviews ---`);
  } catch (error: any) {
    console.error('--- Sync Failed ---', error.message);
  }
};
