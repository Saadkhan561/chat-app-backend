import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { WorkspaceMembersEntity } from "./workspace-members.entity.js";
import { ConversationEntity } from "../../conversations-module/entity/conversations.entity.js";
import { ProjectEntity } from "../../project-module/project.entity.js";

@Entity("work-space")
export class WorkspaceEntity {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column()
  name!: string;

  @OneToMany("workspace-members", "workspace", {
    cascade: true,
  })
  workspaceMembers!: WorkspaceMembersEntity[];

  @OneToMany("conversations", "workspace", { cascade: true })
  conversations!: ConversationEntity[];

  @OneToMany("project", "workspace", { cascade: true })
  projects!: ProjectEntity[];

  @CreateDateColumn()
  created_at!: Date;

  @UpdateDateColumn()
  updated_at!: Date;

  @DeleteDateColumn()
  deleted_at!: Date;
}
