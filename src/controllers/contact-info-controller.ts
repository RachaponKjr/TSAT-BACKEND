import { Request, Response } from 'express';
import { getContact, updateContact } from '../service/contact-info-service';

const getContactController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const contact = await getContact();
    res.status(200).json({ status: 200, data: contact });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
  }
};

const updateContactController = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const body = req.body;
    const contact = await updateContact({ data: body, id });
    res.status(200).json({ status: 200, data: contact });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
  }
};

export { getContactController, updateContactController };
