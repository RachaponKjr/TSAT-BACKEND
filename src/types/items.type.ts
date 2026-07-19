import { z } from 'zod';

export const ItemReqSchema = z.object({
  imageUrl: z.string().optional(),
  name: z.string(),
  unit: z.string(),
  price: z.number()
});

export type TItemReq = z.infer<typeof ItemReqSchema>;
