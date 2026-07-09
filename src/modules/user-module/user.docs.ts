import z from "zod";
import { userSchema } from "../../dto/user.dto.js";
import { registry } from "../../docs/openapi.js";
import { usersByWorkspaceResponseSchema } from "../../shared/schemas/user.schema.js";

registry.registerPath({
  method: "get",
  path: "/users/me",
  tags: ["Users"],
  summary: "Get current logged-in user",
  description: "Fetch details of the authenticated user using JWT",
  responses: {
    200: {
      description: "User fetched successfully",
      content: {
        "application/json": {
          schema: z.object({
            user: userSchema,
            message: z.string(),
          }),
        },
      },
    },
    400: {
      description: "Failed to fetch user",
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

registry.registerPath({
  method: "get",
  path: "/users/{workspaceId}/all-users",
  tags: ["Users"],
  summary: "Get users by workspace",
  description: "Fetch paginated users belonging to a workspace",
  request: {
    params: z.object({
      workspaceId: z.string(),
    }),
    query: z.object({
      search: z.string().optional(),
      limit: z.string(),
      offset: z.string(),
    }),
  },
  responses: {
    200: {
      description: "Users fetched successfully",
      content: {
        "application/json": {
          schema: usersByWorkspaceResponseSchema,
        },
      },
    },
    400: {
      description: "Failed to fetch users",
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
