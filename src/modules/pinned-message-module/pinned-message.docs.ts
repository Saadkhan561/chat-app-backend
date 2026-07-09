import { registry } from "../../docs/openapi.js";
import { z } from "zod";
import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import {
  createPinnedMessageDocsSchema,
  createPinnedMessageSchema,
} from "../../dto/pinned-message.dto.js";

extendZodWithOpenApi(z);

export const pinnedMessageResponseSchema = z
  .object({
    id: z.string(),
    conversationId: z.string(),
    messageId: z.string(),
    pinnedBy: z.string(),
    createdAt: z.string(),
  })
  .openapi("PinnedMessageResponse");

registry.registerPath({
  method: "get",
  path: "/pinned-message/{conversationId}",
  tags: ["Pinned Messages"],
  summary: "Get all pinned messages of a conversation",
  request: {
    params: z.object({
      conversationId: z.string(),
    }),
    query: z.object({
      offset: z.number(),
      limit: z.number(),
    }),
  },
  responses: {
    200: {
      description: "Pinned messages fetched successfully",
      content: {
        "application/json": {
          schema: z.array(pinnedMessageResponseSchema),
        },
      },
    },
  },
});

registry.registerPath({
  method: "post",
  path: "/pinned-message",
  tags: ["Pinned Messages"],
  summary: "Pin a message in a conversation",
  request: {
    body: {
      content: {
        "application/json": {
          schema: createPinnedMessageDocsSchema,
        },
      },
    },
  },
  responses: {
    200: {
      description: "Message pinned successfully",
      content: {
        "application/json": {
          schema: pinnedMessageResponseSchema,
        },
      },
    },
  },
});

registry.registerPath({
  method: "delete",
  path: "/pinned-message/{pinnedId}",
  tags: ["Pinned Messages"],
  summary: "Unpin a message",
  request: {
    params: z.object({
      pinnedId: z.string(),
    }),
  },
  responses: {
    200: {
      description: "Pinned message removed successfully",
      content: {
        "application/json": {
          schema: z.object({
            message: z.string(),
          }),
        },
      },
    },
  },
});
