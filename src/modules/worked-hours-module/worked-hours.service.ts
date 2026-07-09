import { AppDataSource } from "../../config/data-source.js";
import { WorkedHoursEntity } from "./worked-hours.entity.js";
import { QueryFailedError } from "typeorm";
import { RequestUserObject } from "../../interfaces/common.js";
import { UserRoleEnum } from "../../enum/common.js";
import { ProjectEntity } from "../project-module/project.entity.js";
import {
  CreateWorkedHoursGroupedDto,
  UpdateWorkedHoursDto,
} from "../../dto/worked-hour.dto.js";

export class WorkedHoursService {
  private workedHoursRepository =
    AppDataSource.getRepository(WorkedHoursEntity);
  private projectsRepository = AppDataSource.getRepository(ProjectEntity);

  async getWorkedHours(
    user: RequestUserObject,
    workspaceId: string,
    limit: number,
    offset: number,
  ) {
    const query = this.workedHoursRepository
      .createQueryBuilder("worked_hours")
      .leftJoin("worked_hours.project", "project")
      .select([
        "worked_hours.id",
        "worked_hours.description",
        "worked_hours.worked_hours",
        "worked_hours.date",
        "project.id",
        "project.name",
      ])
      .where("project.workspaceId = :workspaceId", { workspaceId })
      .limit(limit)
      .offset(offset);

    if (user.role === UserRoleEnum.EMPLOYEE) {
      query.where("worked_hours.emp_id = :empId", {
        empId: user.userId,
      });
    }

    const [worked_hours, count] = await query
      .orderBy("worked_hours.date", "DESC")
      .getManyAndCount();

    const totalPages = Math.ceil(count / limit);
    const pageNo = offset / limit + 1;

    return {
      worked_hours,
      pagination: {
        limit,
        offset,
        pageNo,
        totalPages,
        total: count,
      },
    };
  }

  async createWorkedHours(
    emp_id: string,
    payload: CreateWorkedHoursGroupedDto,
  ) {
    const newWorkedHours: WorkedHoursEntity[] = [];

    for (const group of payload.groups) {
      const { date, items } = group;

      for (const item of items) {
        const existingProject = await this.projectsRepository.findOne({
          where: { id: item.project_id },
        });

        if (!existingProject) {
          continue;
        }

        const workedHour = this.workedHoursRepository.create({
          description: item.description,
          worked_hours: item.worked_hours,
          date: date,
          project: { id: item.project_id },
          user: { id: emp_id },
        });

        newWorkedHours.push(workedHour);
      }
    }

    try {
      const saved = await this.workedHoursRepository.save(newWorkedHours);

      return {
        items: saved,
        message:
          saved.length > 1
            ? "Worked hours created successfully"
            : "Worked hour created successfully",
      };
    } catch (error: any) {
      if (error instanceof QueryFailedError) {
        const driverError = error.driverError;

        if (driverError.code === "23503") {
          throw new Error("Invalid project_id or emp_id");
        }

        if (driverError.code === "23505") {
          throw new Error("Duplicate entry");
        }
      }

      throw error;
    }
  }

  async updateWorkedHours(id: string, payload: UpdateWorkedHoursDto) {
    const worked_hours = await this.workedHoursRepository.findOne({
      where: { id },
    });

    if (!worked_hours) {
      throw new Error("Worked hour does not exist");
    }

    const updatedWorkedHours = this.workedHoursRepository.merge(
      worked_hours,
      payload,
    );

    await this.workedHoursRepository.save(updatedWorkedHours);

    return { message: "Worked hour updated successfully" };
  }
}
