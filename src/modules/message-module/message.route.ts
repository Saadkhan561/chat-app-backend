import { Router } from "express";
import { MessageController } from "./message.controller.js";
import { validate } from "../../middlewares/validate.middleware.js";
import {
  createMessageSchema,
  updateMessageSchema,
} from "../../dto/message.dto.js";

const router = Router();
const controller = new MessageController();

router.post("/", validate(createMessageSchema), (req, res) =>
  controller.createMessage(req, res),
);

router.post("/:messageId/reply", validate(createMessageSchema), (req, res) =>
  controller.createMessageReply(req, res),
);

router.get("/:conversationId", (req, res) =>
  controller.getMessagesByConversation(req, res),
);

router.patch("/:id", validate(updateMessageSchema), (req, res) =>
  controller.updateMessage(req, res),
);

export default router;
