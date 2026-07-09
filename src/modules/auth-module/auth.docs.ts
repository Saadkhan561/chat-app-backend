import { registry } from "../../docs/openapi.js";
import {
  createUserSchema,
  forgotPasswordSchema,
  loginUserSchema,
  resetPasswordSchema,
  verifyOtpSchema,
} from "../../dto/auth.dto.js";
import { z } from "zod";
import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";

// Extend zod with OpenAPI
extendZodWithOpenApi(z);

registry.registerPath({
  method: "post",
  path: "/auth/login",
  summary: "Login user",
  tags: ["Auth"],

  request: {
    body: {
      content: {
        "application/json": {
          schema: loginUserSchema,
        },
      },
    },
  },

  responses: {
    200: {
      description: "Login successful",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              accessToken: { type: "string" },
              message: { type: "string" },
              user: {
                $ref: "#/components/schemas/User",
              },
            },
            required: ["accessToken", "message", "user"],
          },
        },
      },
    },
  },
});

registry.registerPath({
  method: "post",
  path: "/auth/sign-up",
  summary: "Create a new user",
  tags: ["Auth"],

  request: {
    body: {
      content: {
        "application/json": {
          schema: createUserSchema,
        },
      },
    },
  },

  responses: {
    200: {
      description: "User created successfully",
      content: {
        "application/json": {
          schema: {
            $ref: "#/components/schemas/User",
          },
        },
      },
    },
  },
});

registry.registerPath({
  method: "post",
  path: "/auth/forgot-password",
  summary: "Send OTP to user",
  tags: ["Auth"],

  request: {
    body: {
      content: {
        "application/json": {
          schema: forgotPasswordSchema,
        },
      },
    },
  },

  responses: {
    200: {
      description: "OTP sent successfully",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              message: {
                type: "string",
                example: "OTP sent to email",
              },
            },
            required: ["message"],
          },
        },
      },
    },

    404: {
      description: "User not found",
    },
  },
});

registry.registerPath({
  method: "post",
  path: "/auth/verify-otp",
  summary: "Verify OTP",
  tags: ["Auth"],

  request: {
    body: {
      content: {
        "application/json": {
          schema: verifyOtpSchema,
        },
      },
    },
  },

  responses: {
    200: {
      description: "OTP verified successfully",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              message: {
                type: "string",
                example: "OTP verified successfully",
              },
            },
            required: ["message"],
          },
        },
      },
    },

    400: {
      description: "Invalid OTP or OTP expired",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              message: {
                type: "string",
                example: "Invalid or expired OTP",
              },
            },
          },
        },
      },
    },

    404: {
      description: "User not found",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              message: {
                type: "string",
                example: "User not found",
              },
            },
          },
        },
      },
    },
  },
});

registry.registerPath({
  method: "patch",
  path: "/auth/reset-password",
  summary: "Reset user password after OTP verification",
  tags: ["Auth"],

  request: {
    body: {
      content: {
        "application/json": {
          schema: resetPasswordSchema,
        },
      },
    },
  },

  responses: {
    200: {
      description: "Password reset successfully",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              message: {
                type: "string",
                example: "Password reset successfully",
              },
            },
            required: ["message"],
          },
        },
      },
    },

    400: {
      description: "Validation error or passwords do not match",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              message: {
                type: "string",
                example: "Passwords do not match",
              },
            },
          },
        },
      },
    },

    401: {
      description: "Unauthorized (OTP not verified or invalid session)",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              message: {
                type: "string",
                example: "Unauthorized request",
              },
            },
          },
        },
      },
    },

    404: {
      description: "User not found",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              message: {
                type: "string",
                example: "User not found",
              },
            },
          },
        },
      },
    },
  },
});
