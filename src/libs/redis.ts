import { createClient } from 'redis';

// 1. ตั้งค่าพิกัดการเชื่อมต่อ (ดึงจาก .env จะหล่อที่สุด)
const redisUrl = process.env.REDIS_URL || 'redis://150.95.26.51:6379';

const redisClient = createClient({
  url: redisUrl
});

// 2. ดักจับสถานะและ Error ป้องกันแอปแครช
redisClient.on('error', (err) => console.error('❌ Redis Client Error:', err));
redisClient.on('connect', () => console.log('🚀 Connecting to Redis...'));
redisClient.on('ready', () => console.log('🟢 Redis Client is Ready!'));

// 3. สั่งให้เปิดท่อการเชื่อมต่อ (ต้องสั่งก่อนเรียกใช้ดึง/เซฟข้อมูล)
async function connectRedis() {
  if (!redisClient.isOpen) {
    await redisClient.connect();
  }
}

// รันฟังก์ชันเปิดท่อเชื่อมต่อทันทีเมื่อแอปเริ่มทำงาน
connectRedis();

export default redisClient;
