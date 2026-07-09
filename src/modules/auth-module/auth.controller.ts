import { Request, Response } from "express";
import { AuthService } from "./auth.service.js";

const authService = new AuthService();

export async function signUp(req: Request, res: Response) {
  try {
    const user = await authService.signUp(req.body);
    res.status(201).json(user);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
}

export async function loginUser(req: Request, res: Response) {
  try {
    const result = await authService.loginUser(req.body);
    res.status(200).json(result);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
}

export async function forgotPassword(req: Request, res: Response) {
  try {
    const result = await authService.forgotPassword(req.body);
    res.status(200).json(result);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
}

export async function verifyOtp(req: Request, res: Response) {
  try {
    const result = await authService.verifyOtp(req.body);
    res.status(200).json(result);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
}

export async function resetPassword(req: Request, res: Response) {
  try {
    const result = await authService.resetPassword(req.body);
    res.status(200).json(result);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
}
