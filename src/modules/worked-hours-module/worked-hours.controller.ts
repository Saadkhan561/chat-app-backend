import { Response } from "express";
import { ReqObject, RequestUserObject } from "../../interfaces/common.js";
import { decodeJwt } from "../../shared/helpers/decodeJwt.js";
import { WorkedHoursService } from "./worked-hours.service.js";

const service = new WorkedHoursService();

export async function getWorkedHours(req: ReqObject, res: Response) {
  try {
    const { limit = 10, offset = 0 } = req.query;

    // const token = req.headers.authorization?.split(" ")[1];
    // const user = decodeJwt(token as string);
    // req.user = user;

    const { workspaceId } = req.params;

    const data = await service.getWorkedHours(
      req.user as RequestUserObject,
      workspaceId as string,
      Number(limit),
      Number(offset),
    );

    res.json(data);
  } catch (error: any) {
    res.status(error.status || 400).json({
      message: error.message || "Something went wrong",
    });
  }
}

export async function createWorkedHours(req: ReqObject, res: Response) {
  try {
    // const token = req.headers.authorization?.split(" ")[1];
    // const user = decodeJwt(token as string);
    // req.user = user;

    const data = await service.createWorkedHours(req.user?.userId ?? '', req.body);

    res.json(data);
  } catch (error: any) {
    res.status(error.status || 400).json({
      message: error.message || "Something went wrong",
    });
  }
}

export async function updateWorkedHours(req: ReqObject, res: Response) {
  try {
    const { id } = req.params;

    const data = await service.updateWorkedHours(id as string, req.body);

    res.json(data);
  } catch (error: any) {
    res.status(error.status || 400).json({
      message: error.message || "Something went wrong",
    });
  }
}
