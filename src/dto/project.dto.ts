import { z } from "zod";

export const createProjectSchema = z.object({
  name: z.string().min(1),

  description: z.string().min(1),

  total_hours: z.number().min(0).optional(),

  start_date: z.string().optional(),

  assigned_to: z.array(z.string()).optional(),

  workspace_id: z.string(),
});

export type CreateProjectDto = z.infer<typeof createProjectSchema>;

export const updateProjectSchema = createProjectSchema.partial();
export type UpdateProjectDto = z.infer<typeof updateProjectSchema>;

export const assignProjectSchema = z.object({
  emp_ids: z.array(z.string()),
});

export type AssignProjectDto = z.infer<typeof assignProjectSchema>;
