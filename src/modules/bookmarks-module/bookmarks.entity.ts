import {
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { UserEntity } from "../user-module/user.entity.js";
import { MessageEntity } from "../message-module/entity/message.entity.js";

@Entity("bookmarks")
export class BookmarksEntity {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @ManyToOne("user", "bookmarks", { onDelete: "CASCADE" })
  user!: UserEntity;

  @ManyToOne("message", "bookmarks", { onDelete: "CASCADE" })
  message!: MessageEntity;

  @CreateDateColumn()
  created_at!: Date;

  @UpdateDateColumn()
  updated_at!: Date;

  @DeleteDateColumn()
  deleted_at!: Date;
}
