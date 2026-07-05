import { Response, Request } from 'express';
import { ReqCreateTemplateSchema } from '../types/reportTemplate.type';
import {
  createTemplate,
  deactivateTemplate,
  getTemplateById,
  getTemplateList
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

export {
  createTemplateController,
  getTemplateListController,
  getTemplateByIdController,
  deactivateTemplateController
};
