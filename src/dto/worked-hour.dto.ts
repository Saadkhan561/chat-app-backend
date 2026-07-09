import { z } from "zod";

export const workedHourItemSchema = z.object({
  description: z.string().min(1, "Description is required"),

  worked_hours: z.number().min(0, "Worked hours is required"),

  project_id: z.string().uuid("Invalid project id"),
});

export const workedHoursGroupSchema = z.object({
  date: z.coerce.date(),

  items: z.array(workedHourItemSchema).min(1, "At least one item is required"),
});

export const createWorkedHoursSchema = z.object({
  groups: z
    .array(workedHoursGroupSchema)
    .min(1, "At least one group is required"),
});

export type WorkedHourItemDto = z.infer<typeof workedHourItemSchema>;
export type WorkedHoursGroupDto = z.infer<typeof workedHoursGroupSchema>;
export type CreateWorkedHoursGroupedDto = z.infer<
  typeof createWorkedHoursSchema
>;

export const updateWorkedHoursSchema = z.object({
  worked_hours: z
    .number()
    .min(0, "Worked hours is required")
    .max(10, "Worked hours must be less than 10"),

  description: z.string().min(1, "Description is required"),
});

export type UpdateWorkedHoursDto = z.infer<typeof updateWorkedHoursSchema>;
