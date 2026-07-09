import { AppDataSource } from "../../config/data-source.js";
import { CreateWorkspaceDto } from "../../dto/workspace.dto.js";
import { UserRoleEnum } from "../../enum/common.js";
import { CreateWorkspaceRespone } from "../../interfaces/workspace.interface.js";
import { WorkspaceMembersEntity } from "./entity/workspace-members.entity.js";
import { WorkspaceEntity } from "./entity/workspace.entity.js";

export class WorkspaceService {
  async createWorkspace(
    userId: string,
    payload: CreateWorkspaceDto,
  ): Promise<CreateWorkspaceRespone> {
    return await AppDataSource.transaction(async (manager) => {
      const workspaceRepo = manager.getRepository(WorkspaceEntity);
      const workspaceMemberRepo = manager.getRepository(WorkspaceMembersEntity);

      const workspace = workspaceRepo.create({
        name: payload.name,
      });

      const newWorkspace = await workspaceRepo.save(workspace);

      const workspaceMembersToCreate = [userId, ...payload.workspaceMembers];

      const workspaceMembers = workspaceMembersToCreate.map((member, index) => {
        return workspaceMemberRepo.create({
          role: index === 0 ? UserRoleEnum.ADMIN : UserRoleEnum.EMPLOYEE,
          user: { id: index === 0 ? userId : member },
          workspace: { id: newWorkspace.id },
        });
      });

      const newWorkspaceMembers =
        await workspaceMemberRepo.save(workspaceMembers);

      return {
        id: newWorkspace.id,
        name: newWorkspace.name,
        members: newWorkspaceMembers.map((member) => ({
          id: member.id,
          userId: member.user.id,
          workspaceId: member.workspace.id,
          role: member.role,
        })),
      };
    });
  }
}
