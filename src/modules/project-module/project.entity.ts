import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { ProjectStatusEnum } from "../../enum/project.enum.js";
import { UserEntity } from "../user-module/user.entity.js";
import { WorkedHoursEntity } from "../worked-hours-module/worked-hours.entity.js";
import { WorkspaceEntity } from "../workspace-module/entity/workspace.entity.js";

@Entity("project")
export class ProjectEntity {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column()
  name!: string;

  @Column()
  description!: string;

  @Column({ default: 0 })
  total_hours!: number;

  @Column({ type: "timestamp", nullable: true })
  start_date!: Date | null;

  @Column({
    enum: ProjectStatusEnum,
    type: "enum",
    default: ProjectStatusEnum.IN_PROGRESS,
  })
  status!: ProjectStatusEnum;

  @ManyToMany("user", "projects", {
    onDelete: "CASCADE",
    nullable: true,
  })
  @JoinTable({
    name: "project_assignments",
    joinColumn: { name: "project_id", referencedColumnName: "id" },
    inverseJoinColumn: { name: "emp_id", referencedColumnName: "id" },
  })
  users!: UserEntity[];

  @OneToMany("worked-hours", "project", {
    cascade: true,
  })
  hours!: WorkedHoursEntity[];

  @ManyToOne("work-space", "projects", { onDelete: "CASCADE" })
  workspace!: WorkspaceEntity;

  @CreateDateColumn()
  created_at!: Date;

  @UpdateDateColumn()
  updated_at!: Date;

  @DeleteDateColumn()
  deleted_at!: Date;
}
