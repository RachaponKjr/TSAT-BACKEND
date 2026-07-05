import { Response, Request } from 'express';
import {
  ReqCreateCategorySchema,
  ReqCreateCriteriaSchema,
  ReqCreateItemSchema,
  ReqCreateOptionSchema,
  ReqCreateTemplateSchema,
  ReqUpdateCategorySchema,
  ReqUpdateCriteriaSchema,
  ReqUpdateItemSchema,
  ReqUpdateOptionSchema,
  ReqUpdateTemplateSchema
} from '../types/reportTemplate.type';
import {
  createCategoryTemplate,
  createCriteriaOption,
  createCriteriaTemplate,
  createItemTemplate,
  createTemplate,
  deactivateTemplate,
  deleteCategoryTemplate,
  deleteCriteriaOption,
  deleteCriteriaTemplate,
  deleteItemTemplate,
  getCriteriaOptionList,
  getTemplateById,
  getTemplateList,
  updateCategoryTemplate,
  updateCriteriaOption,
  updateCriteriaTemplate,
  updateItemTemplate,
  updateTemplateInfo
} from '../service/report-template.service';

const createTemplateController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const parseResult = ReqCreateTemplateSchema.safeParse(req.body);
    if (!parseResult.success) {
      res.status(400).json({
        message: 'Invalid request data',
        errors: parseResult.error.flatten().fieldErrors
      });
      return;
    }
    const template = await createTemplate({ data: parseResult.data });
    res.status(200).json({ data: template });
    return;
  } catch (error) {
    res.status(500).json({
      message: error instanceof Error ? error.message : 'Internal Server Error'
    });
    return;
  }
};

const getTemplateListController = async (
  _req: Request,
  res: Response
): Promise<void> => {
  try {
    const list = await getTemplateList();
    res.status(200).json({ data: list });
    return;
  } catch (error) {
    res
      .status(500)
      .json({ message: error instanceof Error ? error.message : error });
    return;
  }
};

const getTemplateByIdController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const template = await getTemplateById({ id });
    if (!template) {
      res.status(404).json({ message: 'Template not found' });
      return;
    }
    res.status(200).json({ data: template });
    return;
  } catch (error) {
    res
      .status(500)
      .json({ message: error instanceof Error ? error.message : error });
    return;
  }
};

const deactivateTemplateController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const template = await deactivateTemplate({ id });
    res.status(200).json({ data: template });
    return;
  } catch (error) {
    res
      .status(500)
      .json({ message: error instanceof Error ? error.message : error });
    return;
  }
};

const updateTemplateController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const parseResult = ReqUpdateTemplateSchema.safeParse(req.body);
    if (!parseResult.success) {
      res.status(400).json({
        message: 'Invalid request data',
        errors: parseResult.error.flatten().fieldErrors
      });
      return;
    }
    const result = await updateTemplateInfo({ id, data: parseResult.data });
    res.status(200).json({ data: result });
    return;
  } catch (error) {
    res
      .status(500)
      .json({ message: error instanceof Error ? error.message : error });
    return;
  }
};

const updateCategoryController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const parseResult = ReqUpdateCategorySchema.safeParse(req.body);
    if (!parseResult.success) {
      res.status(400).json({
        message: 'Invalid request data',
        errors: parseResult.error.flatten().fieldErrors
      });
      return;
    }
    const result = await updateCategoryTemplate({ id, data: parseResult.data });
    res.status(200).json({ data: result });
    return;
  } catch (error) {
    res
      .status(500)
      .json({ message: error instanceof Error ? error.message : error });
    return;
  }
};

const updateItemController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const parseResult = ReqUpdateItemSchema.safeParse(req.body);
    if (!parseResult.success) {
      res.status(400).json({
        message: 'Invalid request data',
        errors: parseResult.error.flatten().fieldErrors
      });
      return;
    }
    const result = await updateItemTemplate({ id, data: parseResult.data });
    res.status(200).json({ data: result });
    return;
  } catch (error) {
    res
      .status(500)
      .json({ message: error instanceof Error ? error.message : error });
    return;
  }
};

const createItemController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { categoryId } = req.params;
    const parseResult = ReqCreateItemSchema.safeParse(req.body);
    if (!parseResult.success) {
      res.status(400).json({
        message: 'Invalid request data',
        errors: parseResult.error.flatten().fieldErrors
      });
      return;
    }
    const result = await createItemTemplate({
      categoryId,
      data: parseResult.data
    });
    res.status(200).json({ data: result });
    return;
  } catch (error) {
    res
      .status(500)
      .json({ message: error instanceof Error ? error.message : error });
    return;
  }
};

const deleteItemController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const result = await deleteItemTemplate({ id });
    res.status(200).json({ data: result });
    return;
  } catch (error) {
    res
      .status(500)
      .json({ message: error instanceof Error ? error.message : error });
    return;
  }
};

const updateCriteriaController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const parseResult = ReqUpdateCriteriaSchema.safeParse(req.body);
    if (!parseResult.success) {
      res.status(400).json({
        message: 'Invalid request data',
        errors: parseResult.error.flatten().fieldErrors
      });
      return;
    }
    const result = await updateCriteriaTemplate({ id, data: parseResult.data });
    res.status(200).json({ data: result });
    return;
  } catch (error) {
    res
      .status(500)
      .json({ message: error instanceof Error ? error.message : error });
    return;
  }
};

// จุดที่ใช้บ่อยสุด: แก้คะแนน + คำอธิบาย ของ rubric option
const updateOptionController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const parseResult = ReqUpdateOptionSchema.safeParse(req.body);
    if (!parseResult.success) {
      res.status(400).json({
        message: 'Invalid request data',
        errors: parseResult.error.flatten().fieldErrors
      });
      return;
    }
    const result = await updateCriteriaOption({ id, data: parseResult.data });
    res.status(200).json({ data: result });
    return;
  } catch (error) {
    res
      .status(500)
      .json({ message: error instanceof Error ? error.message : error });
    return;
  }
};

const createOptionController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { criteriaId } = req.params;
    const parseResult = ReqCreateOptionSchema.safeParse(req.body);
    if (!parseResult.success) {
      res.status(400).json({
        message: 'Invalid request data',
        errors: parseResult.error.flatten().fieldErrors
      });
      return;
    }
    const result = await createCriteriaOption({
      criteriaId,
      data: parseResult.data
    });
    res.status(200).json({ data: result });
    return;
  } catch (error) {
    res
      .status(500)
      .json({ message: error instanceof Error ? error.message : error });
    return;
  }
};

const deleteOptionController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const result = await deleteCriteriaOption({ id });
    res.status(200).json({ data: result });
    return;
  } catch (error) {
    res
      .status(500)
      .json({ message: error instanceof Error ? error.message : error });
    return;
  }
};

const getCriteriaOptionListController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { criteriaId } = req.params;
    const options = await getCriteriaOptionList({ criteriaId });
    res.status(200).json({ data: options });
    return;
  } catch (error) {
    res
      .status(500)
      .json({ message: error instanceof Error ? error.message : error });
    return;
  }
};

const createCategoryController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { templateId } = req.params;
    const parseResult = ReqCreateCategorySchema.safeParse(req.body);
    if (!parseResult.success) {
      res.status(400).json({
        message: 'Invalid request data',
        errors: parseResult.error.flatten().fieldErrors
      });
      return;
    }
    const result = await createCategoryTemplate({
      templateId,
      data: parseResult.data
    });
    res.status(200).json({ data: result });
    return;
  } catch (error) {
    res
      .status(500)
      .json({ message: error instanceof Error ? error.message : error });
    return;
  }
};

const deleteCategoryController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const result = await deleteCategoryTemplate({ id });
    res.status(200).json({ data: result });
    return;
  } catch (error) {
    res
      .status(500)
      .json({ message: error instanceof Error ? error.message : error });
    return;
  }
};

const createCriteriaController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { itemId } = req.params;
    const parseResult = ReqCreateCriteriaSchema.safeParse(req.body);
    if (!parseResult.success) {
      res.status(400).json({
        message: 'Invalid request data',
        errors: parseResult.error.flatten().fieldErrors
      });
      return;
    }
    const result = await createCriteriaTemplate({
      itemId,
      data: parseResult.data
    });
    res.status(200).json({ data: result });
    return;
  } catch (error) {
    res
      .status(500)
      .json({ message: error instanceof Error ? error.message : error });
    return;
  }
};

const deleteCriteriaController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const result = await deleteCriteriaTemplate({ id });
    res.status(200).json({ data: result });
    return;
  } catch (error) {
    res
      .status(500)
      .json({ message: error instanceof Error ? error.message : error });
    return;
  }
};

export {
  createTemplateController,
  getTemplateListController,
  getTemplateByIdController,
  deactivateTemplateController,
  updateTemplateController,
  updateCategoryController,
  updateItemController,
  createItemController,
  deleteItemController,
  updateCriteriaController,
  updateOptionController,
  createOptionController,
  deleteOptionController,
  getCriteriaOptionListController,
  createCategoryController,
  deleteCategoryController,
  createCriteriaController,
  deleteCriteriaController
};
