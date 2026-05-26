import { createClient } from 'redis';

// 🟢 1. ตั้งค่าการเชื่อมต่อ Redis (ปรับ host/port ให้ตรงกับ VPS ของคุณ)
const client = createClient({
    url: 'redis://127.0.0.1:6379' 
});

const PATTERN_TO_CLEAR = 'blog:list:*'; // 🧹 ใส่ Pattern ที่ต้องการลบตรงนี้

async function clearRedisPattern() {
    try {
        await client.connect();
        console.log('🚀 Connected to Redis successfully.');

        let cursor = '0';
        let totalDeleted = 0;

        do {
            // สแกนหาคีย์ที่ตรงกับ Pattern ทีละ 100 คีย์
            const reply = await client.scan(cursor, {
                MATCH: PATTERN_TO_CLEAR,
                COUNT: 100
            });

            cursor = reply.cursor;
            const keys = reply.keys;

            if (keys.length > 0) {
                // ลบคีย์ชุดที่เจอ
                await client.del(keys);
                totalDeleted += keys.length;
                console.log(`   Found and deleted ${keys.length} keys...`);
            }

        } while (cursor !== '0');

        console.log(`\n✨ Done! Total cleared: ${totalDeleted} keys for "${PATTERN_TO_CLEAR}"`);

    } catch (err) {
        console.error('❌ Error clearing Redis:', err);
    } finally {
        await client.disconnect();
    }
}

clearRedisPattern();