import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { BookmarksEntity } from "../bookmarks-module/bookmarks.entity.js";
import { ConversationParticipantEntity } from "../conversations-module/entity/conversation-participants.entity.js";
import { MessageEntity } from "../message-module/entity/message.entity.js";
import { ProjectEntity } from "../project-module/project.entity.js";
import { WorkedHoursEntity } from "../worked-hours-module/worked-hours.entity.js";
import { WorkspaceMembersEntity } from "../workspace-module/entity/workspace-members.entity.js";
import { PinnedMessagEntity } from "../pinned-message-module/pinned-message.entity.js";

@Entity("user")
export class UserEntity {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column()
  first_name!: string;

  @Column()
  last_name!: string;

  @Column()
  email!: string;

  @Column()
  password!: string;

  @Column({ type: "varchar" })
  phone!: string;

  @Column()
  company!: string;

  @Column()
  designation!: string;

  @Column()
  employee_id!: number;

  @Column({
    nullable: true,
  })
  avatar!: string;

  @Column({ type: "varchar", nullable: true })
  otp!: string | null;

  @Column({ type: "timestamptz", nullable: true })
  otpExpiry!: Date | null;

  @Column({ default: false })
  otpVerified!: boolean;

  @CreateDateColumn()
  created_at!: Date;

  @UpdateDateColumn()
  updated_at!: Date;

  @DeleteDateColumn()
  deleted_at!: Date;

  @ManyToMany("project", "users", {
    cascade: true,
  })
  projects!: ProjectEntity[];

  @OneToMany("worked-hours", "user", { cascade: true })
  worked_hours!: WorkedHoursEntity[];

  @OneToMany("workspace-members", "user", {
    cascade: true,
  })
  workspaceMembers!: WorkspaceMembersEntity[];

  @OneToMany("conversation-participants", "user", { cascade: true })
  participants!: ConversationParticipantEntity[];

  @OneToMany("message", "sender", { cascade: true })
  messages!: MessageEntity[];

  @OneToMany("bookmarks", "user", { cascade: true })
  bookmarks!: BookmarksEntity[];

  @OneToMany("pinned-message", "user", { cascade: true })
  pinnedMessages!: PinnedMessagEntity[];
}
