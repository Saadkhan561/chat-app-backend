import { registry } from "../../docs/openapi.js";
import { z } from "zod";
import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import { createBookmarkSchema } from "../../dto/bookmarks.dto.js";

extendZodWithOpenApi(z);

export const bookmarkResponseSchema = z
  .object({
    id: z.string(),
    userId: z.string(),
    messageId: z.string(),
    createdAt: z.string(),
  })
  .openapi("BookmarkResponse");

registry.registerPath({
  method: "get",
  path: "/bookmarks",
  tags: ["Bookmarks"],
  summary: "Get all bookmarks",
  request: {
    query: z.object({
      offset: z.number(),
      limit: z.number(),
    }),
  },

  responses: {
    200: {
      description: "Bookmarks fetched successfully",
      content: {
        "application/json": {
          schema: z.object({
            bookmarks: z.array(bookmarkResponseSchema),
          }),
        },
      },
    },
  },
});

registry.registerPath({
  method: "post",
  path: "/bookmarks",
  tags: ["Bookmarks"],
  summary: "Create a bookmark for a message",
  request: {
    body: {
      content: {
        "application/json": {
          schema: createBookmarkSchema,
        },
      },
    },
  },
  responses: {
    200: {
      description: "Bookmark created successfully",
      content: {
        "application/json": {
          schema: bookmarkResponseSchema,
        },
      },
    },
  },
});

registry.registerPath({
  method: "delete",
  path: "/bookmarks/{bookmarkId}",
  tags: ["Bookmarks"],
  summary: "Remove a bookmark",
  request: {
    params: z.object({
      bookmarkId: z.string(),
    }),
  },
  responses: {
    200: {
      description: "Bookmark removed successfully",
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
