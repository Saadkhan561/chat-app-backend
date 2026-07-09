import { z } from "zod";
import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import { UserRoleEnum } from "../enum/common.js";

extendZodWithOpenApi(z);

export const UserRoleSchema = z.nativeEnum(UserRoleEnum);

export const userSchema = z
  .object({
    id: z.string(),
    first_name: z.string(),
    last_name: z.string(),
    email: z.string().email(),
    phone: z.string(),
    company: z.string(),
    designation: z.string(),
    employee_id: z.number(),
    role: UserRoleSchema,
    avatar: z.string().nullable(),
    workspaceId: z.string(),
  })
  .openapi("User");
