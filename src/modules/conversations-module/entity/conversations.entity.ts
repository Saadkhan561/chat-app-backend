import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { ConversationTypeEnum } from "../../../enum/conversations.enum.js";
import { MessageEntity } from "../../message-module/entity/message.entity.js";
import { ConversationParticipantEntity } from "./conversation-participants.entity.js";
import { PinnedMessagEntity } from "../../pinned-message-module/pinned-message.entity.js";
import { WorkspaceEntity } from "../../workspace-module/entity/workspace.entity.js";

@Entity("conversations")
export class ConversationEntity {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ type: "varchar", nullable: true })
  name?: string | null;

  @Column({
    type: "enum",
    enum: ConversationTypeEnum,
    default: ConversationTypeEnum.DM,
  })
  type!: ConversationTypeEnum;

  @Column({ unique: true, nullable: true, type: "varchar" })
  dmKey!: string | null;

  @OneToMany("conversation-participants", "conversation", { cascade: true })
  participants!: ConversationParticipantEntity[];

  @OneToMany("message", "conversation", { cascade: true })
  messages!: MessageEntity[];

  @OneToMany("pinned-message", "conversation", { cascade: true })
  pinnedMessages!: PinnedMessagEntity[];

  @ManyToOne("work-space", "conversations", {
    onDelete: "CASCADE",
    nullable: true,
  })
  workspace!: WorkspaceEntity;

  @CreateDateColumn()
  created_at!: Date;

  @UpdateDateColumn()
  updated_at!: Date;

  @DeleteDateColumn()
  deleted_at!: Date;
}
