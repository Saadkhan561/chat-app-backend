import { Router } from "express";
import { getUserById, getUsersByWorkspace } from "./user.controller.js";

const router = Router();

router.get("/me", getUserById);
router.get("/:workspaceId/all-users", getUsersByWorkspace);

export default router;
