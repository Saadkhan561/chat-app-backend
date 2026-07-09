import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import { z } from "zod";
import { registry } from "../../docs/openapi.js";
import {
  conversationDetailsSchema,
  ConversationTypeSchema,
  createConversationSchema,
} from "../../dto/conversations.dto.js";

extendZodWithOpenApi(z);

export const conversationUserSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string(),
});

export const conversationResponseSchema = z
  .object({
    conversationId: z.string(),
    type: ConversationTypeSchema,
    displayName: z.string(),
    users: z.array(conversationUserSchema).optional(),
  })
  .openapi("ConversationResponse");

registry.registerPath({
  method: "get",
  path: "/conversations/dm/{workspaceId}",
  tags: ["Conversations"],
  summary: "Get DM conversations + workspace members mapping",
  request: {
    params: z.object({
      workspaceId: z.string(),
    }),
  },
  responses: {
    200: {
      description: "List of DM conversations (with members)",
      content: {
        "application/json": {
          schema: z.array(
            z.object({
              userId: z.string(),
              displayName: z.string(),
              avatar: z.string().optional(),
              conversationId: z.string().nullable(),
              hasConversation: z.boolean(),
              type: ConversationTypeSchema,
            }),
          ),
        },
      },
    },
  },
});

registry.registerPath({
  method: "get",
  path: "/conversations/group/{workspaceId}",
  tags: ["Conversations"],
  summary: "Get all group conversations for workspace",
  request: {
    params: z.object({
      workspaceId: z.string(),
    }),
  },
  responses: {
    200: {
      description: "List of group conversations",
      content: {
        "application/json": {
          schema: z.array(
            z.object({
              conversationId: z.string(),
              type: ConversationTypeSchema,
              displayName: z.string(),
              users: z.array(conversationUserSchema),
            }),
          ),
        },
      },
    },
  },
});

registry.registerPath({
  method: "post",
  path: "/conversations",
  tags: ["Conversations"],
  summary: "Create a new conversation (DM or GROUP)",
  request: {
    body: {
      content: {
        "application/json": {
          schema: createConversationSchema,
        },
      },
    },
  },
  responses: {
    200: {
      description: "Conversation created successfully",
      content: {
        "application/json": {
          schema: z.object({
            message: z.string(),
            conversation: z.any(),
          }),
        },
      },
    },
  },
});

registry.registerPath({
  method: "get",
  path: "/conversations/{conversationId}",
  tags: ["Conversations"],
  summary: "Get conversation details by ID",
  request: {
    params: z.object({
      conversationId: z.string(),
    }),
  },
  responses: {
    200: {
      description: "Conversation details fetched successfully",
      content: {
        "application/json": {
          schema: conversationDetailsSchema,
        },
      },
    },
    500: {
      description: "Conversation not found or server error",
      content: {
        "application/json": {
          schema: z.object({
            success: z.boolean(),
            message: z.string(),
          }),
        },
      },
    },
  },
});
