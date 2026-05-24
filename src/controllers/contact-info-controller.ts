import { Request, Response } from 'express';
import { getContact, updateContact } from '../service/contact-info-service';
import redisClient from '../libs/redis';

const getContactController = async (
  req: Request,
  res: Response
): Promise<void> => {
  const CACHE_KEY = 'contact:all:data';

  try {
    const cachedContact = await redisClient.get(CACHE_KEY);

    if (cachedContact) {
      res.status(200).json({
        status: 200,
        data: JSON.parse(cachedContact),
        fromCache: true
      });
      return;
    }

    const contact = await getContact();

    await redisClient.set(CACHE_KEY, JSON.stringify(contact), {
      EX: 3600 * 6
    });

    res.status(200).json({ status: 200, data: contact });
    return;
  } catch (error) {
    console.error('❌ Error in getContactController:', error);
    res.status(500).json({ message: 'Server Error', error });
    return;
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
