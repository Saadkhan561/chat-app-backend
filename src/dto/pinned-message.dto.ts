import { z } from "zod";

export const createPinnedMessageSchema = z.object({
  conversationId: z.string().min(1, "Conversation ID is required"),
  messageId: z.string().min(1, "Message ID is required"),
  pinned_by: z.string().min(1, "Pinned by is required"),
});

export type CreatePinnedMessageDto = z.infer<typeof createPinnedMessageSchema>;

export const createPinnedMessageDocsSchema = z.object({
  conversationId: z.string().min(1, "Conversation ID is required"),
  messageId: z.string().min(1, "Message ID is required"),
});
