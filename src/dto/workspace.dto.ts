import { z } from "zod";

export const createWorkspaceSchema = z.object({
  name: z.string().min(1, "Workspace name is required"),
  workspaceMembers: z.array(
    z.string().min(1, "Workspace member ID is required"),
  ),
});

export type CreateWorkspaceDto = z.infer<typeof createWorkspaceSchema>;
