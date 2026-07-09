import { Router } from "express";
import { validate } from "../../middlewares/validate.middleware.js";

import {
  createWorkedHoursSchema,
  updateWorkedHoursSchema,
} from "../../dto/worked-hour.dto.js";

import {
  getWorkedHours,
  createWorkedHours,
  updateWorkedHours,
} from "./worked-hours.controller.js";

const router = Router();

router.get("/:workspaceId", (req, res) => getWorkedHours(req, res));

router.post("/", validate(createWorkedHoursSchema), (req, res) =>
  createWorkedHours(req, res),
);

router.patch("/:id", validate(updateWorkedHoursSchema), (req, res) =>
  updateWorkedHours(req, res),
);

export default router;
