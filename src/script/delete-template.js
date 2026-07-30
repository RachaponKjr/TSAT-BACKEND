/* eslint-disable no-undef */
import { PrismaClient } from '@prisma/client';

const db = new PrismaClient();

async function deleteTemplateCascade(templateId) {
  try {
    console.log(
      `กำลังเริ่มลบข้อมูลที่เกี่ยวข้องกับ Template ID: ${templateId}...`
    );

    // 1. ดึง ID ของหมวดหมู่ (Categories) ทั้งหมดที่อยู่ใน Template นี้
    const categories = await db.inspectionCategoryTemplate.findMany({
      where: { templateId },
      select: { id: true }
    });
    const categoryIds = categories.map((c) => c.id);

    // 2. ดึง ID ของ รายการย่อย (Items) ทั้งหมดที่อยู่ใน Categories
    const items = await db.inspectionItemTemplate.findMany({
      where: { categoryId: { in: categoryIds } },
      select: { id: true }
    });
    const itemIds = items.map((i) => i.id);

    // 3. ดึง ID ของ หัวข้อคะแนน (Criteria) ทั้งหมดที่อยู่ใน Items
    const criteria = await db.inspectionCriteriaTemplate.findMany({
      where: { itemId: { in: itemIds } },
      select: { id: true }
    });
    const criteriaIds = criteria.map((cr) => cr.id);

    // --- เริ่มทยอยลบจากตารางล่างสุดขึ้นบน ---

    // ลบ Options
    await db.inspectionCriteriaOption.deleteMany({
      where: { criteriaId: { in: criteriaIds } }
    });

    // ลบ Criteria
    await db.inspectionCriteriaTemplate.deleteMany({
      where: { itemId: { in: itemIds } }
    });

    // ลบ Items
    await db.inspectionItemTemplate.deleteMany({
      where: { categoryId: { in: categoryIds } }
    });

    // ลบ Categories
    await db.inspectionCategoryTemplate.deleteMany({
      where: { templateId }
    });

    // ลบ Reports ที่ผูกไว้
    await db.inspectionReport.deleteMany({
      where: { templateId }
    });

    // 4. สุดท้าย: ลบตัว Template หลัก
    await db.inspectionTemplate.delete({
      where: { id: templateId }
    });

    console.log(`✅ ลบ Template ID: ${templateId} และข้อมูลลูกเรียบร้อยแล้ว!`);
  } catch (error) {
    console.error('เกิดข้อผิดพลาดในการลบ:', error);
  } finally {
    await db.$disconnect();
  }
}

// 📌 ระบุ ID ที่ต้องการลบ
deleteTemplateCascade('cms75ixoy0067s601xqb5xuxl');
