import { z } from "zod";
import {
  AttachmentType,
  MessageStatusEnum,
  MessageTypeEnum,
} from "../enum/message.enum.js";

export const attachmentSchema = z.object({
  fileName: z.string().min(1, "File name is required"),

  fileUrl: z.string().min(1, "File url is required"),

  mimeType: z.string().min(1, "Mime type is required"),

  attachmentType: z.enum([
    AttachmentType.IMAGE,
    AttachmentType.FILE,
    AttachmentType.AUDIO,
  ]),

  size: z.number().positive("Size must be greater than 0"),
});

export const createMessageSchema = z.object({
  content: z.string().min(1, "Content is required"),

  type: z.enum([MessageTypeEnum.TEXT]),

  status: z.enum([MessageStatusEnum.UNREAD]),

  conversation_id: z.string(),

  sent_by: z.string(),

  attachments: z.array(attachmentSchema).optional(),
});

export type CreateMessageDto = z.infer<typeof createMessageSchema>;
export const updateMessageSchema = z.object({
  content: z.string().min(1, "Content is required"),
});

export type UpdateMessageDto = z.infer<typeof updateMessageSchema>;
