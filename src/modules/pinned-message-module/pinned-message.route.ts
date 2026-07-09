import { Router } from "express";
import { createPinnedMessageDocsSchema } from "../../dto/pinned-message.dto.js";
import { validate } from "../../middlewares/validate.middleware.js";
import {
  createPinnedMessage,
  deletePinnedMessage,
  getPinnedMessages,
} from "./pinned-message.controller.js";

const router = Router();

router.get("/:conversationId", getPinnedMessages);
router.post("/", validate(createPinnedMessageDocsSchema), createPinnedMessage);
router.delete("/:id", deletePinnedMessage);

export default router;
