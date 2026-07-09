import { z } from "zod";
import { ConversationTypeEnum } from "../enum/conversations.enum.js";
import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";

export const ConversationTypeSchema = z.enum(["DM", "GROUP"]);

export type ConversationType = z.infer<typeof ConversationTypeSchema>;

export const createConversationSchema = z.object({
  type: z.enum([ConversationTypeEnum.DM, ConversationTypeEnum.GROUP]),

  name: z.string().min(1).optional().nullable(),

  creator_id: z.string(),

  conversation_members: z.array(z.string()).min(1),

  workspaceId: z.string(),
});

export type CreateConversationDto = z.infer<typeof createConversationSchema>;

extendZodWithOpenApi(z);

export const participantDetailsSchema = z.object({
  id: z.string(),
  userId: z.string(),
  first_name: z.string(),
  last_name: z.string(),
  email: z.string(),
  role: z.string().nullable(),
});

export const conversationDetailsSchema = z
  .object({
    id: z.string(),
    name: z.string().nullable(),
    type: ConversationTypeSchema,
    participants: z.array(participantDetailsSchema),
  })
  .openapi("ConversationDetails");
