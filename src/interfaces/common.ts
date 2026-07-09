import { Request } from "express";
import { UserRoleEnum } from "../enum/common.js";

export interface RequestUserObject {
  userId: string;
  email: string;
  role: UserRoleEnum;
}

export interface ReqObject extends Request {
  user?: RequestUserObject;
  limit?: number;
  offset?: number;
}

export interface Pagination {
  totalPages: number;
  pageNo: number;
  limit: number;
  offset: number;
  total: number;
}
