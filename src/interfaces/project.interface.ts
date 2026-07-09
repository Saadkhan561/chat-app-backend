import { ProjectEntity } from "../modules/project-module/project.entity.js";

export type ProjectResponse = Omit<ProjectEntity, "start_date"> & {
  start_date?: string;
};
