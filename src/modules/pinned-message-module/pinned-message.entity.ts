import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { ConversationEntity } from "../conversations-module/entity/conversations.entity.js";
import { MessageEntity } from "../message-module/entity/message.entity.js";
import { UserEntity } from "../user-module/user.entity.js";

@Entity("pinned-message")
export class PinnedMessagEntity {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @ManyToOne("conversations", "pinnedMessages", { onDelete: "CASCADE" })
  conversation!: ConversationEntity;

  @ManyToOne("message", "pinned", { onDelete: "CASCADE" })
  message!: MessageEntity;

  @ManyToOne("user", "pinnedMessages", { onDelete: "CASCADE" })
  pinnedBy!: UserEntity;

  @CreateDateColumn()
  created_at!: Date;

  @UpdateDateColumn()
  updated_at!: Date;

  @DeleteDateColumn()
  deleted_at!: Date;
}
