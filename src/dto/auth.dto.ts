import { z } from "zod";

export const createUserSchema = z.object({
  first_name: z.string().min(1, "First name is required"),

  last_name: z.string().min(1, "Last name is required"),

  email: z.email("Invalid email format"),

  password: z.string().min(6, "Password must be at least 6 characters"),

  phone: z.string().min(1, "Phone is required"),

  company: z.string().min(1, "Company is required"),

  designation: z.string().min(1, "Designation is required"),

  employee_id: z.coerce
    .number()
    .int("Employee ID must be an integer")
    .positive("Employee ID must be positive"),
});

export type CreateUserDto = z.infer<typeof createUserSchema>;

export const loginUserSchema = z
  .object({
    email: z.email("Invalid email format"),

    password: z.string().min(1, "Password is required"),
  })
  .strict();

export type LoginUserDto = z.infer<typeof loginUserSchema>;

const updateUserSchema = z.object({
  first_name: z.string().min(1, "First name is required"),

  last_name: z.string().min(1, "Last name is required"),

  email: z.string().email("Invalid email format"),

  password: z.string().min(6, "Password must be at least 6 characters"),

  phone: z.string().min(1, "Phone is required"),
});

export type UpdateUserDto = z.infer<typeof updateUserSchema>;

export const forgotPasswordSchema = z
  .object({
    email: z.email("Invalid email format"),
  })
  .strict();

export type ForgotPasswordDto = z.infer<typeof forgotPasswordSchema>;

export const verifyOtpSchema = z
  .object({
    otp: z.string().length(6),
    email: z.email("Invalid email format"),
  })
  .strict();

export type VerifyOtpDtpo = z.infer<typeof verifyOtpSchema>;

export const resetPasswordSchema = z
  .object({
    email: z.email("Invalid email format"),
    newPassword: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Must contain at least one uppercase letter")
      .regex(/[0-9]/, "Must contain at least one number")
      .regex(/[^A-Za-z0-9]/, "Must contain at least one special character"),
  })
  .strict();

export type ResetPasswordDto = z.infer<typeof resetPasswordSchema>;
