import { registry } from "../../docs/openapi.js";
import {
  assignProjectSchema,
  createProjectSchema,
  updateProjectSchema,
} from "../../dto/project.dto.js";
import { z } from "zod";
import { paginationSchema } from "../../shared/docs/common.js";

const userRef = z.object({
  id: z.string().uuid(),
  email: z.string(),
});

const projectRef = z.object({
  id: z.string().uuid(),
  name: z.string(),
  description: z.string(),
  total_hours: z.number(),
  start_date: z.string().nullable(),
  status: z.string(),
  users: z.array(userRef).optional(),
  created_at: z.string(),
  updated_at: z.string(),
});

registry.registerPath({
  method: "get",
  path: "/projects/{workspaceId}",
  tags: ["Projects"],
  summary: "Get all projects",
  request: {
    params: z.object({
      workspaceId: z.string(),
    }),
  },
  responses: {
    200: {
      description: "List of projects",
      content: {
        "application/json": {
          schema: z.object({
            projects: z.array(projectRef),
            pagination: paginationSchema,
          }),
        },
      },
    },
  },
});

registry.registerPath({
  method: "post",
  path: "/projects",
  tags: ["Projects"],
  summary: "Create project",
  request: {
    body: {
      content: {
        "application/json": {
          schema: createProjectSchema,
        },
      },
    },
  },
  responses: {
    200: {
      description: "Project created",
      content: {
        "application/json": {
          schema: projectRef,
        },
      },
    },
  },
});

registry.registerPath({
  method: "patch",
  path: "/projects/{id}",
  tags: ["Projects"],
  summary: "Update project",
  request: {
    params: z.object({
      id: z.string().uuid(),
    }),
    body: {
      content: {
        "application/json": {
          schema: updateProjectSchema,
        },
      },
    },
  },
  responses: {
    200: {
      description: "Project updated",
      content: {
        "application/json": {
          schema: projectRef,
        },
      },
    },
  },
});

registry.registerPath({
  method: "delete",
  path: "/projects/{id}",
  tags: ["Projects"],
  summary: "Delete project",
  request: {
    params: z.object({
      id: z.string().uuid(),
    }),
  },
  responses: {
    200: {
      description: "Project deleted",
      content: {
        "application/json": {
          schema: z.object({
            message: z.string(),
          }),
        },
      },
    },
  },
});

registry.registerPath({
  method: "post",
  path: "/projects/{id}/assign",
  tags: ["Projects"],
  summary: "Assign employees to project",
  request: {
    params: z.object({
      id: z.string().uuid(),
    }),
    body: {
      content: {
        "application/json": {
          schema: assignProjectSchema,
        },
      },
    },
  },
  responses: {
    200: {
      description: "Employees assigned",
      content: {
        "application/json": {
          schema: z.object({
            message: z.string(),
          }),
        },
      },
    },
  },
});

registry.registerPath({
  method: "post",
  path: "/projects/{id}/remove",
  tags: ["Projects"],
  summary: "Remove employees from project",
  request: {
    params: z.object({
      id: z.string().uuid(),
    }),
    body: {
      content: {
        "application/json": {
          schema: assignProjectSchema,
        },
      },
    },
  },
  responses: {
    200: {
      description: "Employees removed",
      content: {
        "application/json": {
          schema: z.object({
            message: z.string(),
          }),
        },
      },
    },
  },
});
