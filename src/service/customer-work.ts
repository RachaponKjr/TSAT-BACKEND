import { PrismaClient } from '@prisma/client';

const db = new PrismaClient();

interface CreateCustomerWorkInput {
  title: string;
  content: any; // JSON จาก Rich Text Editor (Quill, Tiptap)
  carModelId?: string;
  carSubModelId?: string;
  tags: string[]; // ตัวอย่าง: ["Macan", "ช่วงล่าง", "ซ่อมถุงลม"]
}

export async function createCustomerWork({
  input,
  images
}: {
  images: string;
  input: CreateCustomerWorkInput;
}) {
  const { title, content, carModelId, tags, carSubModelId } = input;

  const newWork = await db.customerWork.create({
    data: {
      title,
      content,
      images: images,
      carSubModel: carSubModelId
        ? { connect: { id: carSubModelId } }
        : undefined,
      carModel: carModelId ? { connect: { id: carModelId } } : undefined,
      tags: {
        create: tags.map((tagName) => ({
          tag: {
            connectOrCreate: {
              where: { name: tagName },
              create: { name: tagName }
            }
          }
        }))
      }
    },
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
    carSubModel: newWork.carSubModel?.name || null,
    carModel: newWork.carModel
      ? {
          id: newWork.carModel.id,
          name: newWork.carModel.name,
          image: newWork.carModel.image
        }
      : null,
    tags: newWork.tags.map((t) => t.tag.name)
  };
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
      carModel: true,
      carSubModel: true
    }
  });
  return {
    works: works.map((work) => ({
      id: work.id,
      title: work.title,
      images: work.images,
      carModel: {
        name: work.carModel?.name || null
      },
      carSubModel: work.carSubModel?.name || null,
      tags: work.tags.map((t) => t.tag.name)
    }))
  };
};

const getCustomerWorks = async () => {
  const works = await db.customerWork.findMany({
    include: {
      carModel: {
        select: {
          name: true
        }
      },
      tags: {
        include: { tag: true }
      }
    }
  });
  return {
    works: works.map((work) => ({
      id: work.id,
      title: work.title,
      images: work.images,
      carModel: work.carModel
        ? {
            name: work.carModel.name
          }
        : null
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
    subCarModel: work.carSubModel?.name || null,
    carModel: work.carModel?.name ?? null,
    tags: work.tags.map((t) => t.tag.name)
  };
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
  getBySubCarModel
};
