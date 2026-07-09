import { Router } from "express";
import { createConversationSchema } from "../../dto/conversations.dto.js";
import { validate } from "../../middlewares/validate.middleware.js";
import {
  createConversation,
  getConversationDetails,
  getDMConversations,
  getGroupConversations,
} from "./conversations.controller.js";

const router = Router();

router.get("/dm/:workspaceId", getDMConversations);
router.get("/group/:workspaceId", getGroupConversations);
router.get("/:conversationId", getConversationDetails);
router.post("/", validate(createConversationSchema), createConversation);

export default router;
