import { prisma as db } from '../libs/prisma';
import { isValidUUID, normalizeUUID } from '../libs/validuuid';

export interface CreateProps {
  tags?: string;
  isShow: boolean;
  title: string;
  content: string;
  serviceId?: string;
  subServiceId?: string;
  carModelId?: string;
  carSubModelId?: string;
  images: string[];
  create_at?: Date;
}

const createPostService = async ({
  createData,
  tags
}: {
  createData: CreateProps;
  tags: string[]; // ชื่อ tag ที่จะสร้างใหม่
}) => {
  const res = await db.customerBlog.create({
    data: {
      ...createData,
      tags: {
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
      }
    },
    include: {
      tags: true
    }
  });

  return res;
};

const getPromotion = async () => {
  const res = await db.customerBlog.findMany({
    where: {
      isShow: true
    }
  });
  console.log(res);
  return res;
};

const getBlogs = async (
  page = 1,
  limit = 20,
  carmodel?: string,
  carsubmodel?: string,
  filter?: string
) => {
  const skip = (page - 1) * limit;

  // สร้าง where เงื่อนไขแบบ dynamic
  const where: any = {};
  // เช็คให้แน่ใจว่าไม่ใช่ "undefined" string หรือ undefined/null/empty
  if (carmodel && carmodel !== 'undefined' && carmodel.trim() !== '') {
    where.carModelId = carmodel;
  }

  if (carsubmodel && carsubmodel !== 'undefined' && carsubmodel.trim() !== '') {
    where.carSubModelId = carsubmodel; // filter ตาม carSubModelId
  }

  if (filter && filter !== 'undefined' && filter.trim() !== '') {
    where.serviceId = filter;
  }

  const res = await db.customerBlog.findMany({
    where,
    include: {
      carModel: {
        select: { name: true }
      },
      tags: {
        select: {
          tag: { select: { name: true } }
        }
      },
      service: {
        select: {
          serviceName: true
        }
      },
      subService: {
        select: {
          subServiceName: true
        }
      }
    },
    orderBy: { create_at: 'desc' },
    skip,
    take: limit
  });
  // แปลง tags
  const transformed = res.map((blog) => ({
    ...blog,
    tags: blog.tags.map((t) => t.tag.name)
  }));

  // นับจำนวนทั้งหมด (ตาม filter ด้วย)
  const total = await db.customerBlog.count({ where });

  return {
    data: transformed,
    pagination: {
      currentPage: page,
      limit,
      total,
      totalPages: Math.ceil(total / limit)
    }
  };
};

const getBlogByCarModel = async ({
  carSubModelId
}: {
  carSubModelId: string;
}) => {
  const resBlog = await db.customerBlog.findMany({
    where: {
      carSubModelId: carSubModelId
    },
    include: {
      carModel: {
        select: {
          name: true
        }
      },
      service: {
        select: {
          serviceName: true
        }
      },
      subService: {
        select: {
          subServiceName: true
        }
      },
      carSubModel: {
        select: {
          name: true
        }
      },
      tags: {
        select: {
          tag: { select: { name: true } }
        }
      }
    }
  });

  // 🛠 map ข้อมูลแต่ละ blog
  const transformed = resBlog.map((blog) => ({
    ...blog,
    tags: blog.tags.map((t) => t.tag.name),
    carModel: blog.carModel?.name,
    carSubModel: blog.carSubModel?.name,
    service: blog.service?.serviceName,
    subService: blog.subService?.subServiceName
  }));

  return transformed;
};

const getBlogById = async ({ id }: { id: string }) => {
  const res = await db.customerBlog.findUnique({
    where: {
      id: id
    },
    include: {
      carModel: {
        select: {
          name: true
        }
      },
      service: {
        select: {
          serviceName: true
        }
      },
      subService: {
        select: {
          subServiceName: true
        }
      },
      carSubModel: {
        select: {
          name: true
        }
      },
      tags: {
        select: {
          tag: { select: { name: true } }
        }
      }
    }
  });

  const transformed = {
    ...res,
    tags: res?.tags.map((t) => t.tag.name),
    carModel: res?.carModel?.name,
    carSubModel: res?.carSubModel?.name,
    service: res?.service?.serviceName,
    subService: res?.subService?.subServiceName
  };

  return transformed;
};

const updateBlog = async ({ id, data }: { id: string; data: CreateProps }) => {
  // แปลง tags เป็น array ให้ถูกต้อง
  let tags: string[] = [];

  if (typeof data.tags === 'string') {
    try {
      tags = JSON.parse(data.tags);
    } catch (e) {
      console.error('Invalid tags JSON:', data.tags);
      tags = [];
    }
  } else if (Array.isArray(data.tags)) {
    tags = data.tags;
  }

  // สร้าง updateData โดย sanitize ฟิลด์ UUID และ boolean
  const updateData: any = {
    ...data,
    tags: undefined, // ลบ key ที่ Prisma ไม่เข้าใจออกก่อน
    serviceId: normalizeUUID(data.serviceId),
    subServiceId: normalizeUUID(data.subServiceId),
    carModelId: normalizeUUID(data.carModelId),
    carSubModelId: normalizeUUID(data.carSubModelId),
    isShow: data.isShow // แปลง string "true"/boolean true เป็น boolean
  };

  const res = await db.customerBlog.update({
    where: { id },
    data: {
      ...updateData,
      ...(tags.length > 0 && {
        tags: {
          deleteMany: {}, // ลบ relation เก่าออกทั้งหมด
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
        }
      })
    },
    include: {
      tags: true
    }
  });

  return res;
};

const delBlog = async (id: string) => {
  const res = await db.customerBlog.delete({
    where: {
      id
    }
  });
  return res;
};

export {
  createPostService,
  getBlogById,
  delBlog,
  getBlogs,
  getBlogByCarModel,
  updateBlog,
  getPromotion
};
