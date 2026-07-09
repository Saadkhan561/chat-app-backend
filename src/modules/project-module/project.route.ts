import { Router } from "express";
import { validate } from "../../middlewares/validate.middleware.js";

import {
  assignProjectSchema,
  createProjectSchema,
  updateProjectSchema,
} from "../../dto/project.dto.js";

import {
  getAllProjects,
  createProject,
  updateProject,
  deleteProject,
  assignProject,
  removeEmployees,
} from "./project.controller.js";

const router = Router();

router.get("/:workspaceId", (req, res) => getAllProjects(req, res));

router.post("/", validate(createProjectSchema), (req, res) =>
  createProject(req, res),
);

router.patch("/:id", validate(updateProjectSchema), (req, res) =>
  updateProject(req, res),
);

router.delete("/:id", (req, res) => deleteProject(req, res));

router.post("/:id/assign", validate(assignProjectSchema), (req, res) =>
  assignProject(req, res),
);

router.post("/:id/remove", validate(assignProjectSchema), (req, res) =>
  removeEmployees(req, res),
);

export default router;
