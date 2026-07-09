import { registry } from "../../docs/openapi.js";
import { z } from "zod";
import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import {
  createMessageSchema,
  updateMessageSchema,
} from "../../dto/message.dto.js";

extendZodWithOpenApi(z);

export const messageResponseSchema = z
  .object({
    id: z.string().uuid(),
    content: z.string(),
    type: z.string(),
    status: z.string(),
    read_at: z.string().nullable(),
    read_by: z.string().nullable(),
    sent_by: z.string().uuid(),
    created_at: z.string(),
    conversation: z.object({
      id: z.string().uuid(),
      name: z.string().nullable(),
      type: z.string(),
    }),
  })
  .openapi("MessageResponse");

registry.registerPath({
  method: "post",
  path: "/message",
  tags: ["Messages"],
  summary: "Create a new message",

  request: {
    body: {
      required: true,
      content: {
        "application/json": {
          schema: createMessageSchema,
        },
      },
    },
  },

  responses: {
    200: {
      description: "Message created successfully",
      content: {
        "application/json": {
          schema: messageResponseSchema,
        },
      },
    },
  },
});

registry.registerPath({
  method: "post",
  path: "/message/{messageId}/reply",
  tags: ["Messages"],
  summary: "Create a new reply",

  request: {
    params: z.object({
      messageId: z.string(),
    }),
    body: {
      required: true,
      content: {
        "application/json": {
          schema: createMessageSchema,
        },
      },
    },
  },

  responses: {
    200: {
      description: "Reply created successfully",
      content: {
        "application/json": {
          schema: messageResponseSchema,
        },
      },
    },
  },
});

registry.registerPath({
  method: "get",
  path: "/message/{conversationId}",
  tags: ["Messages"],
  summary: "Get messages by conversation",

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
      description: "Messages fetched successfully",
      content: {
        "application/json": {
          schema: z.object({
            messages: z.array(messageResponseSchema),
            pagination: z.object({
              limit: z.number(),
              offset: z.number(),
              pageNo: z.number(),
              totalPages: z.number(),
              total: z.number(),
            }),
          }),
        },
      },
    },
  },
});
registry.registerPath({
  method: "patch",
  path: "/message/{messageid}",
  tags: ["Messages"],
  summary: "Update a message",

  request: {
    params: z.object({
      messageid: z.string().uuid(),
    }),
    body: {
      required: true,
      content: {
        "application/json": {
          schema: updateMessageSchema,
        },
      },
    },
  },

  responses: {
    200: {
      description: "Message updated successfully",
      content: {
        "application/json": {
          schema: messageResponseSchema,
        },
      },
    },
  },
});
