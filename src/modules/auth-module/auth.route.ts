import { Router } from "express";
import {
  signUp,
  loginUser,
  forgotPassword,
  verifyOtp,
  resetPassword,
} from "./auth.controller.js";
import { validate } from "../../middlewares/validate.middleware.js";
import {
  forgotPasswordSchema,
  loginUserSchema,
  resetPasswordSchema,
  verifyOtpSchema,
} from "../../dto/auth.dto.js";

const router = Router();

router.post("/sign-up", (req, res) => signUp(req, res));
router.post("/login", validate(loginUserSchema), (req, res) =>
  loginUser(req, res),
);
router.post("/forgot-password", validate(forgotPasswordSchema), (req, res) =>
  forgotPassword(req, res),
);
router.post("/verify-otp", validate(verifyOtpSchema), (req, res) =>
  verifyOtp(req, res),
);
router.patch("/reset-password", validate(resetPasswordSchema), (req, res) =>
  resetPassword(req, res),
);

export default router;
