import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { ProjectEntity } from "../project-module/project.entity.js";
import { UserEntity } from "../user-module/user.entity.js";

@Entity("worked-hours")
export class WorkedHoursEntity {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ nullable: false })
  description!: string;

  @Column({ nullable: true, type: "decimal", precision: 4, scale: 2 })
  worked_hours!: number;

  @Column({ nullable: true })
  date!: Date;

  @ManyToOne("project", "hours", {
    onDelete: "CASCADE",
    nullable: false,
  })
  @JoinColumn({ name: "project_id" })
  project!: ProjectEntity;

  @ManyToOne(() => UserEntity, (user) => user.worked_hours, {
    onDelete: "CASCADE",
    nullable: false,
  })
  @JoinColumn({ name: "emp_id" })
  user!: UserEntity;

  @CreateDateColumn()
  created_at!: Date;

  @UpdateDateColumn()
  updated_at!: Date;

  @DeleteDateColumn()
  deleted_at!: Date;
}
