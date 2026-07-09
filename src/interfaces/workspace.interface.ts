import { UserRoleEnum } from "../enum/common.js";

export interface WorkspaceMember {
  id: string;
  userId: string;
  workspaceId: string;
  role: UserRoleEnum;
}

export interface CreateWorkspaceRespone {
  id: string;
  name: string;
  members: WorkspaceMember[];
}
