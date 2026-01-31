import { prisma as db } from '../libs/prisma';

interface CreateCustomerWorkInput {
  title: string;
  content: any; // JSON จาก Rich Text Editor (Quill, Tiptap)
  carModelId?: string;
  carSubModelId?: string;
  serviceId: string;
  subServiceId: string;
  tags: string[]; // ตัวอย่าง: ["Macan", "ช่วงล่าง", "ซ่อมถุงลม"]
  isShow: string;
}

export async function createCustomerWork({
  input,
  images
}: {
  images: string;
  input: CreateCustomerWorkInput;
}) {
  const {
    title,
    content,
    carModelId,
    tags,
    carSubModelId,
    isShow,
    serviceId,
    subServiceId
  } = input;

  // แก้ไข: เช็ค type ของ isShow ก่อน
  const isShowFormat =
    typeof isShow === 'string' ? isShow === 'true' : Boolean(isShow);

  try {
    // สร้าง data object โดยแยกเป็นส่วน ๆ
    const createData: any = {
      title,
      content,
      isShow: isShowFormat,
      serviceId,
      subServiceId,
      images: images,
      carSubModelId: carSubModelId || null
    };

    // เพิ่ม carModelId เฉพาะเมื่อมีค่า (ใช้ carModelId แทน carModel relation)
    if (carModelId) {
      createData.carModelId = carModelId;
    }

    // เพิ่ม tags เฉพาะเมื่อมีข้อมูล
    if (tags && tags.length > 0) {
      createData.tags = {
        create: tags
          .filter((tagName) => tagName && tagName.trim()) // กรองค่าว่าง
          .map((tagName) => ({
            tag: {
              connectOrCreate: {
                where: { name: tagName.trim() },
                create: { name: tagName.trim() }
              }
            }
          }))
      };
    }

    const newWork = await db.customerWork.create({
      data: createData,
      include: {
        carSubModel: true,
        carModel: true,
        tags: {
          include: { tag: true }
        }
      }
    });

    return {
      id: newWork.id,
      title: newWork.title,
      content: newWork.content,
      images: newWork.images,
      isShow: newWork.isShow,
      carSubModel: newWork.carSubModel?.name || null,
      carModel: newWork.carModel
        ? {
            id: newWork.carModel.id,
            name: newWork.carModel.name,
            image: newWork.carModel.image
          }
        : null,
      tags: newWork.tags?.map((t) => t.tag.name) || [],
      createdAt: newWork.createdAt,
      updatedAt: newWork.updatedAt
    };
  } catch (error) {
    console.error('Error creating customer work:', error);
    throw new Error('Failed to create customer work');
  }
}
const getWithCarModel = async ({ carModeId }: { carModeId: string }) => {
  const works = await db.customerWork.findMany({
    where: {
      carModel: {
        id: carModeId
      }
    }
  });
  return works;
};

const getBySubCarModel = async ({
  carSubModelId
}: {
  carSubModelId: string;
}) => {
  const works = await db.customerWork.findMany({
    where: {
      carSubModel: {
        id: carSubModelId
      }
    },
    include: {
      tags: {
        include: { tag: true }
      },
      service: true,
      subService: true,
      carModel: true,
      carSubModel: true
    }
  });
  return {
    works: works.map((work) => ({
      id: work.id,
      title: work.title,
      images: work.images,
      carModel: work.carModel?.name,
      carSubModel: work.carSubModel?.name,
      service: work.service?.serviceName,
      subService: work.subService?.subServiceName,
      tags: work.tags.map((t) => t.tag.name)
    }))
  };
};

const getCustomerWorks = async () => {
  const works = await db.customerWork.findMany({
    include: {
      carSubModel: true,
      carModel: true,
      tags: {
        include: { tag: true }
      },
      service: true,
      subService: true
    }
  });
  return {
    works: works.map((work) => ({
      id: work.id,
      title: work.title,
      isShow: work.isShow,
      images: work.images,
      updata_at: work.updatedAt,
      tags: work.tags.map((item) => item.tag.name),
      service: work.service?.serviceName,
      subService: work.subService?.subServiceName,
      carSubModel: work.carSubModel?.name,
      carModel: work.carModel?.name
    }))
  };
};

const getCustomerWork = async ({ id }: { id: string }) => {
  const work = await db.customerWork.findUnique({
    where: {
      id: id
    },
    include: {
      carSubModel: true,
      carModel: true,
      service: true,
      subService: true,
      tags: {
        include: { tag: true }
      }
    }
  });

  if (!work) return null;

  return {
    id: work.id,
    title: work.title,
    content: work.content,
    images: work.images,
    isShow: work.isShow,
    service: { name: work.service?.serviceName, id: work.service?.id },
    subService: {
      name: work.subService?.subServiceName,
      id: work.subService?.id
    },
    carModel: { name: work.carModel?.name, id: work.carModel?.id },
    carSubModel: { name: work.carSubModel?.name, id: work.carSubModel?.id },
    // service: work.service?.serviceName,
    // subService: work.subService?.subServiceName,
    // carSubModel: work.carSubModel?.name || null,
    // carModel: work.carModel?.name ?? null,
    tags: work.tags.map((t) => t.tag.name)
  };
};

const updateCustomerWork = async ({
  id,
  images,
  workData
}: {
  id: string;
  images: string;
  workData: CreateCustomerWorkInput;
}) => {
  const {
    title,
    content,
    carModelId,
    tags,
    carSubModelId,
    isShow,
    serviceId,
    subServiceId
  } = workData;

  const isShowFormat =
    typeof isShow === 'string' ? isShow === 'true' : Boolean(isShow);

  try {
    // ลบ tags เดิมออกก่อน เพื่อหลีกเลี่ยง duplicated relation
    await db.customerWorkTag.deleteMany({
      where: {
        customerWorkId: id
      }
    });

    // เตรียมข้อมูลใหม่
    const updateData: any = {
      title,
      content,
      isShow: isShowFormat,
      serviceId,
      subServiceId,
      images,
      carSubModelId: carSubModelId || null,
      carModelId: carModelId || null
    };

    // ถ้ามี tags ใหม่
    if (tags && tags.length > 0) {
      updateData.tags = {
        create: tags
          .filter((tagName) => tagName && tagName.trim())
          .map((tagName) => ({
            tag: {
              connectOrCreate: {
                where: { name: tagName.trim() },
                create: { name: tagName.trim() }
              }
            }
          }))
      };
    }

    const updatedWork = await db.customerWork.update({
      where: { id },
      data: updateData,
      include: {
        carSubModel: true,
        carModel: true,
        tags: {
          include: { tag: true }
        }
      }
    });

    return {
      id: updatedWork.id,
      title: updatedWork.title,
      content: updatedWork.content,
      images: updatedWork.images,
      isShow: updatedWork.isShow,
      carSubModel: updatedWork.carSubModel?.name || null,
      carModel: updatedWork.carModel
        ? {
            id: updatedWork.carModel.id,
            name: updatedWork.carModel.name,
            image: updatedWork.carModel.image
          }
        : null,
      tags: updatedWork.tags.map((t) => t.tag.name),
      updatedAt: updatedWork.updatedAt
    };
  } catch (error) {
    console.error('Error updating customer work:', error);
    throw new Error('Failed to update customer work');
  }
};

const deleteCustomerWork = async ({ id }: { id: string }) => {
  const work = await db.customerWork.delete({
    where: {
      id: id
    }
  });
  return work;
};

export {
  getCustomerWork,
  getCustomerWorks,
  deleteCustomerWork,
  getWithCarModel,
  getBySubCarModel,
  updateCustomerWork
};
