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
import { ConversationEntity } from "../../conversations-module/entity/conversations.entity.js";
import {
  MessageStatusEnum,
  MessageTypeEnum,
} from "../../../enum/message.enum.js";
import { AttachmentEntity } from "./attachment.entity.js";
import { UserEntity } from "../../user-module/user.entity.js";
import { BookmarksEntity } from "../../bookmarks-module/bookmarks.entity.js";
import { PinnedMessagEntity } from "../../pinned-message-module/pinned-message.entity.js";

@Entity("message")
export class MessageEntity {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column()
  content!: string;

  @Column({
    type: "enum",
    default: MessageTypeEnum.TEXT,
    enum: MessageTypeEnum,
  })
  type!: MessageTypeEnum;

  @Column({
    type: "enum",
    default: MessageStatusEnum.UNREAD,
    enum: MessageStatusEnum,
  })
  status!: MessageStatusEnum;

  @Column({ type: "timestamptz", nullable: true })
  read_at!: Date | null;

  @Column({ type: "simple-array", nullable: true })
  read_by!: string[] | null;

  @OneToMany("attachments", "message", {
    cascade: true,
  })
  attachments!: AttachmentEntity[];

  @ManyToOne("conversations", "messages", { onDelete: "CASCADE" })
  conversation!: ConversationEntity;

  @ManyToOne("user", "messages", { onDelete: "CASCADE" })
  sender!: UserEntity;

  @OneToMany("bookmarks", "message", { cascade: true })
  bookmarks!: BookmarksEntity[];

  @OneToMany("pinned-message", "message", { cascade: true })
  pinned!: PinnedMessagEntity[];

  @OneToMany("message", "parentMessage", { cascade: true })
  replies!: MessageEntity[];

  @ManyToOne("message", "replies", { onDelete: "CASCADE", nullable: true })
  parentMessage!: MessageEntity;

  @CreateDateColumn()
  created_at!: Date;

  @UpdateDateColumn()
  updated_at!: Date;

  @DeleteDateColumn()
  deleted_at!: Date;
}
