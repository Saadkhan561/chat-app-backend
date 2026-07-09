import { UserRoleEnum } from "../enum/common.js";
import { UserEntity } from "../modules/user-module/user.entity.js";
import { Pagination } from "./common.js";

export interface LoginUserResponse {
  accessToken: string;
  message: string;
  user: User;
}

export interface User {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  company: string;
  designation: string;
  employee_id: number;
  role: UserRoleEnum;
  avatar: string | null;
  workspaceId: string;
}

export interface GetUsersByWorkspaceResponse {
  users: Partial<User>;
  pagination: Pagination;
}
