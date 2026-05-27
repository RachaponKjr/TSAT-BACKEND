import { Request, Response } from 'express';
import fs from 'fs';
import {
  createPostService,
  CreateProps,
  delBlog,
  getBlogByCarModel,
  getBlogById,
  getBlogs,
  getPromotion,
  updateBlog
} from '../service/new-blog-service';
import path from 'path';
import { parseThaiDateString } from '../libs/thai-date';
import redisClient from '../libs/redis';

const clearCachePattern = async (pattern: string) => {
  let cursor = '0';
  do {
    // สแกนหาคีย์ตาม Pattern (ทีละ 100 คีย์เพื่อไม่ให้เซิร์ฟเวอร์ค้าง)
    const reply = await redisClient.scan(cursor, {
      MATCH: pattern,
      COUNT: 100
    });
    cursor = reply.cursor;
    const keys = reply.keys;

    if (keys.length > 0) {
      await redisClient.del(keys);
    }
  } while (cursor !== '0');
};

const createBlogController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const CACHE_KEY = 'blog:list:*';
    const files = req.files as Express.Multer.File[];
    const imagePaths = files.map((file) => file.path);
    const parsedTags = JSON.parse(req.body.tags);
    const payload: CreateProps = {
      isShow: req.body.isShow === 'true',
      title: req.body.title,
      content: req.body.content,
      serviceId: req.body.serviceId || undefined,
      subServiceId: req.body.subServiceId || undefined,
      carModelId: req.body.carModelId || undefined,
      carSubModelId: req.body.carSubModelId || undefined,
      images: imagePaths,
      create_at: req.body.create_at
        ? parseThaiDateString(req.body.create_at)
        : new Date()
    };

    const create = await createPostService({
      createData: payload,
      tags: parsedTags
    });

    if (!create) {
      res.status(400).send({ message: 'ไม่สามารถ สร้างblog ได้' });
      return;
    }
    await Promise.all([
      clearCachePattern('blog:list:*'),
      clearCachePattern('blog:carmodel:*')
    ]);

    res.status(201).send({ create, message: 'สร้างสำเร็จ' });
    return;
  } catch (err) {
    res.status(500).send(err);
    return;
  }
};

const getPromotionController = async (req: Request, res: Response) => {
  try {
    const result = await getPromotion();
    if (result.length === 0) {
      res.status(400).send({ message: 'ไม่พบ Promotion' });
      return;
    }
    res.status(200).send({ data: result, message: 'สำเร็จ' });
    return;
  } catch (err) {
    console.log(err);
    res.status(500).send('Server Error!');
    return;
  }
};

const getBlogsController = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const carmodel = String(req.query.carmodel as string) || '';
    const subcar = String(req.query.subcar as string) || '';
    const filter = String(req.query.filter as string) || '';

    const CACHE_KEY = `blog:list:page=${page}:limit=${limit}:carmodel=${carmodel}:subcar=${subcar}:filter=${filter}`;

    const cachedBlogs = await redisClient.get(CACHE_KEY);

    if (cachedBlogs) {
      res.status(200).send(JSON.parse(cachedBlogs));
      return;
    }

    const result = await getBlogs(page, limit, carmodel, subcar, filter);

    if (result.data.length === 0) {
      res.status(400).send({ message: 'ไม่พบBlog' });
      return;
    }

    await redisClient.set(CACHE_KEY, JSON.stringify(result), {
      EX: 3600
    });

    res.status(200).send(result);
    return;
  } catch (err) {
    console.log(err);
    res.status(500).send('Server Error!');
  }
};

const getBlogByIdController = async (req: Request, res: Response) => {
  try {
    const { id } = req.params as { id: string };
    const CACHE_KEY = `blog:id:${id}`;
    const cachedBlog = await redisClient.get(CACHE_KEY);
    if (cachedBlog) {
      res
        .status(200)
        .send({ data: JSON.parse(cachedBlog), message: 'สำเร็จ (จากแคช)' });
      return;
    }
    const getRes = await getBlogById({ id });
    if (!getRes) {
      res.status(400).send({ message: 'ไม่พบ Blog' });
      return;
    }
    await redisClient.set(CACHE_KEY, JSON.stringify(getRes), { EX: 3600 });
    res.status(200).send({ data: getRes, message: 'สำเร็จ' });
    return;
  } catch (err) {
    res.status(500).send('Server Error!');
    return;
  }
};

const getBlogByCarmodel = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const CACHE_KEY = `blog:carmodel:${id}`;
    const cachedCarBlogs = await redisClient.get(CACHE_KEY);
    if (cachedCarBlogs) {
      res.status(200).send({ data: JSON.parse(cachedCarBlogs) });
      return;
    }
    if (!id) {
      res.status(400).send({ message: ' กรุณาส่ง carModelId' });
      return;
    }
    const resCarmodel = await getBlogByCarModel({ carSubModelId: id });
    if (resCarmodel.length === 0) {
      res.status(400).send({ message: 'ไม่พบBlog' });
      return;
    }
    await redisClient.set(CACHE_KEY, JSON.stringify(resCarmodel), { EX: 3600 });
    res.status(200).send({
      data: [...resCarmodel]
    });
    return;
  } catch (err) {
    res.status(500).send('Server Error!');
  }
};

const updateBlogController = async (req: Request, res: Response) => {
  try {
    const { id } = req.params as { id: string };
    let { keepimages, ...rest } = req.body;

    const checkBlog = await getBlogById({ id });

    const files = req.files as Express.Multer.File[];
    const imagePaths = files.map((file) => file.path);

    // 🟢 แปลง keepimages ให้เป็น array เสมอ
    if (typeof keepimages === 'string') {
      try {
        keepimages = JSON.parse(keepimages);
      } catch {
        keepimages = [keepimages];
      }
    }
    if (!Array.isArray(keepimages)) keepimages = [];

    // 🟢 filter blob: ออก
    keepimages = keepimages.filter(
      (img: string) => typeof img === 'string' && !img.startsWith('blob:')
    );

    // 🟢 payload base
    const payload = {
      ...rest,
      isShow: req.body.isShow === 'true',
      create_at: req.body.create_at ? new Date(req.body.create_at) : new Date(),
      images: checkBlog.images
    };

    // 🟢 update images เฉพาะถ้ามีค่าใหม่
    if (keepimages.length > 0 || imagePaths.length > 0) {
      payload.images = [...keepimages, ...imagePaths];
    }
    const updateRes = await updateBlog({ id, data: payload });

    await Promise.all([
      clearCachePattern('blog:list:*'),
      redisClient.del(`blog:id:${id}`),
      clearCachePattern('blog:carmodel:*')
    ]);

    res.status(200).send({ data: { ...updateRes } });
  } catch (err) {
    console.log('❌ updateBlogController error:', err);
    res.status(500).send({ err, message: 'Server Error!' });
  }
};

const delBlogController = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // get blog by id
    const checkBlog = await getBlogById({ id });
    if (!checkBlog) {
      res.status(404).send({
        message: 'ไม่พบ blog'
      });
    }

    if (Array.isArray(checkBlog?.images)) {
      checkBlog.images.forEach((imgPath) => {
        if (typeof imgPath === 'string') {
          const filePath = path.join(__dirname, '../../', imgPath);
          fs.unlink(filePath, async (err) => {
            if (err) {
              console.error('ลบรูปไม่สำเร็จ:', filePath, err.message);
              return;
            } else {
              console.log('ลบรูปสำเร็จ:', filePath);
            }
          });
        }
      });
    }

    await Promise.all([
      clearCachePattern('blog:list:*'),
      redisClient.del(`blog:id:${id}`),
      clearCachePattern('blog:carmodel:*')
    ]);

    await delBlog(id);
    res.status(200).send({ message: 'ลบสำเร็จ', data: { ...checkBlog } });
    return;
  } catch (err) {
    res.status(500).send('Server Error!');
  }
};

export {
  createBlogController,
  delBlogController,
  getBlogsController,
  getBlogByCarmodel,
  getBlogByIdController,
  updateBlogController,
  getPromotionController
};
