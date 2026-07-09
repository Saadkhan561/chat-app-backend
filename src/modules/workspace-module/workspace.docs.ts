import { registry } from "../../docs/openapi.js";
import { z } from "zod";
import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import { createWorkspaceSchema } from "../../dto/workspace.dto.js";

extendZodWithOpenApi(z);

export const workspaceMemberResponseSchema = z
  .object({
    id: z.string(),
    user: z.string(),
    workspace: z.string(),
    role: z.string(),
  })
  .openapi("WorkspaceMemberResponse");

export const workspaceResponseSchema = z
  .object({
    id: z.string(),
    name: z.string(),
    members: z.array(workspaceMemberResponseSchema),
  })
  .openapi("WorkspaceResponse");

registry.registerPath({
  method: "post",
  path: "/workspace",
  tags: ["Workspace"],
  summary: "Create a new workspace with members",
  request: {
    body: {
      content: {
        "application/json": {
          schema: createWorkspaceSchema,
        },
      },
    },
  },
  responses: {
    200: {
      description: "Workspace created successfully",
      content: {
        "application/json": {
          schema: workspaceResponseSchema,
        },
      },
    },
  },
});
