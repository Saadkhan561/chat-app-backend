import { Router } from "express";
import { validate } from "../../middlewares/validate.middleware.js";
import { createBookmarkSchema } from "../../dto/bookmarks.dto.js";
import {
  createBookmark,
  deleteBookmark,
  getBookmarks,
} from "./bookmarks.controller.js";

const router = Router();

router.get("/", getBookmarks);
router.post("/", validate(createBookmarkSchema), createBookmark);
router.delete("/:id", deleteBookmark);

export default router;
