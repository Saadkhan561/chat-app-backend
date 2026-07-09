import { Router } from "express";
import authRoutes from "./modules/auth-module/auth.route.js";
import projectRoutes from "./modules/project-module/project.route.js";
import workedHoursRoutes from "./modules/worked-hours-module/worked-hours.route.js";
import conversationRoutes from "./modules/conversations-module/conversations.route.js";
import messageRoutes from "./modules/message-module/message.route.js";
import bookmarksRoutes from "./modules/bookmarks-module/bookmarks.route.js";
import pinnedMessageRoutes from "./modules/pinned-message-module/pinned-message.route.js";
import workspaceRoutes from "./modules/workspace-module/workspace.route.js";
import userRoutes from "./modules/user-module/user.route.js";
import { authMiddleware } from "./middlewares/auth.middleware.js";
const router = Router();

router.use("/workspace", authMiddleware, workspaceRoutes);
router.use("/auth", authRoutes);
router.use("/users", authMiddleware, userRoutes);
router.use("/projects", authMiddleware, projectRoutes);
router.use("/worked-hours", authMiddleware, workedHoursRoutes);
router.use("/conversations", authMiddleware, conversationRoutes);
router.use("/message", authMiddleware, messageRoutes);
router.use("/bookmarks", authMiddleware, bookmarksRoutes);
router.use("/pinned-message", authMiddleware, pinnedMessageRoutes);

export default router;
