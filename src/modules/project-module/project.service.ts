import { DeepPartial, In } from "typeorm";
import { AppDataSource } from "../../config/data-source.js";
import { ProjectEntity } from "./project.entity.js";
import { UserEntity } from "../user-module/user.entity.js";
import { UserRoleEnum } from "../../enum/common.js";
import { RequestUserObject } from "../../interfaces/common.js";
import {
  AssignProjectDto,
  CreateProjectDto,
  UpdateProjectDto,
} from "../../dto/project.dto.js";
import { ProjectResponse } from "../../interfaces/project.interface.js";

export class ProjectService {
  private projectRepository = AppDataSource.getRepository(ProjectEntity);
  private userRepository = AppDataSource.getRepository(UserEntity);

  async getAllProjects(
    limit: number,
    offset: number,
    user: RequestUserObject,
    workspaceId: string,
  ) {
    const query = this.projectRepository
      .createQueryBuilder("projects")
      .leftJoin("projects.users", "users")
      .select([
        "projects.id",
        "projects.name",
        "projects.description",
        "projects.total_hours",
        "projects.start_date",
        "projects.status",
        "users.id",
        "users.email",
      ])
      .where("projects.workspaceId = :workspaceId", { workspaceId })
      .limit(limit)
      .offset(offset);

    if (user.role === UserRoleEnum.EMPLOYEE) {
      query.andWhere("users.id = :userId", { userId: user.userId });
    }

    const [projects, count] = await query.getManyAndCount();

    const totalPages = Math.ceil(count / limit);
    const pageNo = offset / limit + 1;

    return {
      projects,
      pagination: {
        limit,
        offset,
        pageNo,
        totalPages,
        total: count,
      },
    };
  }

  async createProject(payload: CreateProjectDto) {
    const { assigned_to, workspace_id, ...rest } = payload;

    const newProject = this.projectRepository.create({
      ...rest,
      workspace: { id: payload.workspace_id },
    } as ProjectResponse);

    if (assigned_to?.length) {
      const employees = await this.userRepository.findBy({
        id: In(assigned_to),
      });
      newProject.users = employees;
    }

    return await this.projectRepository.save(newProject);
  }

  async updateProject(id: string, payload: UpdateProjectDto) {
    const project = await this.projectRepository.findOne({ where: { id } });

    if (!project) {
      throw new Error("Project not found");
    }

    const updatedProject = this.projectRepository.merge(
      project,
      payload as DeepPartial<ProjectEntity>,
    );
    return await this.projectRepository.save(updatedProject);
  }

  async deleteProject(id: string) {
    const existingProject = await this.projectRepository.findOne({
      where: { id },
    });

    if (!existingProject) {
      throw new Error("Project does not exist");
    }

    await this.projectRepository.softDelete(id);

    return { message: "Project deleted successfully" };
  }

  async assignProject(id: string, payload: AssignProjectDto) {
    const project = await this.projectRepository.findOne({
      where: { id },
      relations: ["users"],
    });

    if (!project) {
      throw new Error("Project not found");
    }

    const employees = await this.userRepository.findBy({
      id: In(payload.emp_ids),
    });

    if (!employees.length) {
      throw new Error("No existing employees with these IDs");
    }

    const existingUserIds = project.users?.map((u) => u.id) || [];
    const newUsers = employees.filter((u) => !existingUserIds.includes(u.id));

    project.users = [
      ...(existingUserIds.map((id) => ({ id })) as any),
      ...newUsers,
    ];

    await this.projectRepository.save(project);

    if (!newUsers.length) {
      return {
        message: "These employee IDs are already assigned to this project",
      };
    }

    return { message: "Employees assigned successfully" };
  }

  async removeEmployeesFromProject(
    projectId: string,
    payload: AssignProjectDto,
  ) {
    const project = await this.projectRepository.findOne({
      where: { id: projectId },
      relations: ["users"],
    });

    if (!project) {
      throw new Error("Project not found");
    }

    if (!project.users?.length) {
      return { message: "No employee are assigned to this project" };
    }

    project.users = project.users.filter(
      (u) => !payload.emp_ids.includes(u.id),
    );

    await this.projectRepository.save(project);

    return { message: "Employees removed" };
  }
}
