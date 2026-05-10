import axios from 'axios';

export async function triggerApifyAndGetData(mapUrl: string) {
  try {
    // 1. สั่งรัน Actor และรอให้เสร็จ (ใช้ wait เพื่อเอาผลลัพธ์ทันที)
    // หมายเหตุ: ถ้าข้อมูลเยอะมาก Google แนะนำให้ใช้ Webhook แทน
    const runResponse = await axios.get(
      `https://api.apify.com/v2/datasets/clh4igbhcbzhThZVu/items?token=${process.env.APIFY_TOKEN}`
    );

    return runResponse.data[0].reviews; // คืนค่า array ของรีวิว
  } catch (error) {
    console.error('Apify API Error:', error);
    return [];
  }
}
