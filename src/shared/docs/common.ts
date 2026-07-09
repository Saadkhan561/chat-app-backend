import { z } from "zod";

export const paginationSchema = z.object({
  limit: z.number(),
  offset: z.number(),
  pageNo: z.number(),
  totalPages: z.number(),
  total: z.number(),
});
