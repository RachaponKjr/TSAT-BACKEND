import { Request, Response } from 'express';
import { ReferencesSchema } from '../../types/quotation.type';
import * as refService from '../../service/quotation/quotation-reference.service';

export const createReferenceController = async (
  req: Request,
  res: Response
) => {
  try {
    const data = ReferencesSchema.safeParse(req.body);
    if (!data.success) {
      res.status(400).json({ error: data.error.issues });
      return;
    }
    const result = await refService.createReference(data.data);
    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getReferencesController = async (_req: Request, res: Response) => {
  try {
    const result = await refService.getReferences();
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getReferenceByIdController = async (
  req: Request,
  res: Response
) => {
  try {
    const { id } = req.params;
    const result = await refService.getReferenceById(id);
    if (!result) {
      res.status(404).json({ error: 'Reference not found' });
      return;
    }
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const updateReferenceController = async (
  req: Request,
  res: Response
) => {
  try {
    const data = ReferencesSchema.partial().safeParse(req.body);
    const { id } = req.params;
    if (!data.success) {
      res.status(400).json({ error: data.error.issues });
      return;
    }
    const result = await refService.updateReference(id, data.data);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const deleteReferenceController = async (
  req: Request,
  res: Response
) => {
  try {
    const { id } = req.params;
    await refService.deleteReference(id);
    res.status(200).json({ message: 'Reference deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};
