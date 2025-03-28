import { z } from 'zod';

const HomeCMSSchema = z.object({
  headerTitle: z.string(),
  headerSubTitle: z.string(),
  headerSlide: z.string(),
  headerChooseService: z.string(),
  SubChooseService: z.string(),
  headerServiceInteresting: z.string(),
  SubServiceinIeresting: z.string(),
  reasonHeader: z.string(),
  reasonSub1: z.string()
});

export type HomeCMS = z.infer<typeof HomeCMSSchema>;
