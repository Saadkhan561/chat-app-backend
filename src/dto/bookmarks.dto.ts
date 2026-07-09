import { z } from "zod";

export const createBookmarkSchema = z.object({
  messageId: z.string().min(1, "Message ID is required"),
});

export type CreateBookmarkDto = z.infer<typeof createBookmarkSchema>;
