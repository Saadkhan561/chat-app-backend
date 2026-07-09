import { Router } from "express";
import { validate } from "../../middlewares/validate.middleware.js";
import { createWorkspaceSchema } from "../../dto/workspace.dto.js";
import { createWorkspace } from "./workspace.controller.js";

const router = Router();

router.post("/", validate(createWorkspaceSchema), createWorkspace);

export default router
