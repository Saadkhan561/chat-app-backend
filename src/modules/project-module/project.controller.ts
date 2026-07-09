import { Request, Response } from "express";
import { ProjectService } from "./project.service.js";
import { ReqObject, RequestUserObject } from "../../interfaces/common.js";
import { decodeJwt } from "../../shared/helpers/decodeJwt.js";

const service = new ProjectService();

export async function getAllProjects(req: ReqObject, res: Response) {
  try {
    const { limit = 10, offset = 0 } = req.query;

    // const token = req.headers.authorization?.split(" ")[1];
    // const user = decodeJwt(token as string);
    // req.user = user;

    const { workspaceId } = req.params;

    const data = await service.getAllProjects(
      Number(limit),
      Number(offset),
      req.user as RequestUserObject,
      workspaceId as string,
    );

    res.json(data);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
}

export async function createProject(req: Request, res: Response) {
  try {
    const data = await service.createProject(req.body);
    res.json(data);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
}

export async function updateProject(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const data = await service.updateProject(id as string, req.body);
    res.json(data);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
}

export async function deleteProject(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const data = await service.deleteProject(id as string);
    res.json(data);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
}

export async function assignProject(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const data = await service.assignProject(id as string, req.body);
    res.json(data);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
}

export async function removeEmployees(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const data = await service.removeEmployeesFromProject(
      id as string,
      req.body,
    );
    res.json(data);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
}
