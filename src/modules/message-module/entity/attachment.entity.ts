import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
} from "typeorm";
import { MessageEntity } from "./message.entity.js";
import { AttachmentType } from "../../../enum/message.enum.js";

@Entity("attachments")
export class AttachmentEntity {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column()
  fileName!: string;

  @Column()
  fileUrl!: string;

  @Column()
  mimeType!: string;

  @Column({
    type: "enum",
    enum: AttachmentType,
  })
  attachmentType!: AttachmentType;

  @Column({ type: "bigint" })
  size!: number;

  @ManyToOne("message", "attachments", {
    onDelete: "CASCADE",
  })
  message!: MessageEntity;

  @CreateDateColumn()
  createdAt!: Date;
}
