import { registry } from "../../docs/openapi.js";
import {
  createWorkedHoursSchema,
  updateWorkedHoursSchema,
} from "../../dto/worked-hour.dto.js";
import { z } from "zod";
import { paginationSchema } from "../../shared/docs/common.js";

const projectRef = z.object({
  id: z.string(),
  name: z.string(),
});

const workedHourRef = z.object({
  id: z.string(),
  description: z.string(),
  worked_hours: z.number(),
  date: z.string(),
  project: projectRef,
});

registry.registerPath({
  method: "get",
  path: "/worked-hours/{workspaceId}",
  tags: ["Worked Hours"],
  summary: "Get worked hours",
  request: {
    params: z.object({
      workspaceId: z.string(),
    }),
    query: z.object({
      limit: z.string().optional(),
      offset: z.string().optional(),
    }),
  },
  responses: {
    200: {
      description: "List of worked hours",
      content: {
        "application/json": {
          schema: z.object({
            worked_hours: z.array(workedHourRef),
            pagination: paginationSchema,
          }),
        },
      },
    },
  },
});

registry.registerPath({
  method: "post",
  path: "/worked-hours",
  tags: ["Worked Hours"],
  summary: "Create worked hours (grouped)",
  request: {
    body: {
      content: {
        "application/json": {
          schema: createWorkedHoursSchema,
        },
      },
    },
  },
  responses: {
    200: {
      description: "Worked hours created",
      content: {
        "application/json": {
          schema: z.object({
            items: z.array(workedHourRef),
            message: z.string(),
          }),
        },
      },
    },
  },
});

registry.registerPath({
  method: "patch",
  path: "/worked-hours/{id}",
  tags: ["Worked Hours"],
  summary: "Update worked hours",
  request: {
    params: z.object({
      id: z.string().uuid(),
    }),
    body: {
      content: {
        "application/json": {
          schema: updateWorkedHoursSchema,
        },
      },
    },
  },
  responses: {
    200: {
      description: "Worked hour updated",
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
