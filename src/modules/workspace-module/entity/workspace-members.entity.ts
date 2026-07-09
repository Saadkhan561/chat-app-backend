import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { UserEntity } from "../../user-module/user.entity.js";
import { WorkspaceEntity } from "./workspace.entity.js";
import { UserRoleEnum } from "../../../enum/common.js";

@Entity("workspace-members")
export class WorkspaceMembersEntity {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @ManyToOne("user", "workspaceMembers", { onDelete: "CASCADE" })
  user!: UserEntity;

  @ManyToOne("work-space", "workspaceMembers", { onDelete: "CASCADE" })
  workspace!: WorkspaceEntity;

  @Column({
    enum: UserRoleEnum,
    type: "enum",
    default: UserRoleEnum.EMPLOYEE,
  })
  role!: UserRoleEnum;

  @CreateDateColumn()
  created_at!: Date;

  @UpdateDateColumn()
  updated_at!: Date;

  @DeleteDateColumn()
  deleted_at!: Date;
}
