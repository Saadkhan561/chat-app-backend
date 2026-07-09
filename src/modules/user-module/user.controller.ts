import { Response } from "express";
import { ReqObject } from "../../interfaces/common.js";
import { UserService } from "./user.service.js";

const userService = new UserService();

export const getUserById = async (req: ReqObject, res: Response) => {
  try {
    const user = await userService.getUserById(req.user?.userId ?? "");
    return res.status(200).json({ user, message: "User fetched successfully" });
  } catch (error) {
    return res
      .status(400)
      .json({ success: false, message: "Failed to fetch user" });
  }
};

export const getUsersByWorkspace = async (req: ReqObject, res: Response) => {
  const { workspaceId } = req.params;
  const { search, limit, offset } = req.query;

  try {
    console.log(req.user?.userId);
    const result = await userService.getUsersByWorkspace(
      workspaceId as string,
      req.user?.userId ?? "",
      search as string,
      Number(limit),
      Number(offset),
    );
    return res
      .status(200)
      .json({ result, message: "Users fetched successfully" });
  } catch (error) {
    console.log({ error });
    return res
      .status(400)
      .json({ success: false, message: "Failed to fetch user" });
  }
};
