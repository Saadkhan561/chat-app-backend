import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { ConversationParticipantRoleEnum } from "../../../enum/conversations.enum.js";
import { ConversationEntity } from "./conversations.entity.js";
import { UserEntity } from "../../user-module/user.entity.js";

@Entity("conversation-participants")
export class ConversationParticipantEntity {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({
    nullable: true,
    type: "enum",
    enum: ConversationParticipantRoleEnum,
  })
  role?: ConversationParticipantRoleEnum | null;

  @ManyToOne("conversations", "participants", { onDelete: "CASCADE" })
  conversation!: ConversationEntity;

  @ManyToOne("user", "participants", {
    onDelete: "CASCADE",
  })
  user!: UserEntity;
}
