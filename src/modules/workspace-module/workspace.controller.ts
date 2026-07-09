import { Response } from "express";
import { ReqObject } from "../../interfaces/common.js";
import { WorkspaceService } from "./workspace.service.js";
import { decodeJwt } from "../../shared/helpers/decodeJwt.js";

const workspace = new WorkspaceService();

export const createWorkspace = async (req: ReqObject, res: Response) => {
  try {
    // const token = req.headers.authorization?.split(" ")[1];
    // const user = decodeJwt(token as string);
    // req.user = user;



    const data = await workspace.createWorkspace(req.user?.userId ?? '', req.body);
    res.json(data);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};
