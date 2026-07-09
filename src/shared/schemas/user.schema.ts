import { z } from "zod";
import { registry } from "../../docs/openapi.js";

export const userPublicSchema = registry.register(
  "User",
  z.object({
    id: z.string(),
    first_name: z.string(),
    last_name: z.string(),
    email: z.string().email(),
    phone: z.string(),
    company: z.string(),
    designation: z.string(),
    employee_id: z.number(),
    role: z.string(),
  }),
);

export const paginationSchema = z.object({
  totalPages: z.number(),
  pageNo: z.number(),
  limit: z.number(),
  offset: z.number(),
  total: z.number(),
});

export const usersByWorkspaceResponseSchema = z.object({
  users: z.array(userPublicSchema),
  pagination: paginationSchema,
  message: z.string(),
});
