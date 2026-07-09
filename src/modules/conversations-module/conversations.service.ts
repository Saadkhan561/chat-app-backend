import { AppDataSource } from "../../config/data-source.js";
import { ConversationEntity } from "./entity/conversations.entity.js";
import { ConversationParticipantEntity } from "./entity/conversation-participants.entity.js";
import {
  ConversationTypeEnum,
  ConversationParticipantRoleEnum,
} from "./../../enum/conversations.enum.js";
import { CreateConversationDto } from "../../dto/conversations.dto.js";
import { Brackets, DeepPartial } from "typeorm";
import { WorkspaceMembersEntity } from "../workspace-module/entity/workspace-members.entity.js";

export class ConversationsService {
  private conversationRepo = AppDataSource.getRepository(ConversationEntity);
  private participantRepo = AppDataSource.getRepository(
    ConversationParticipantEntity,
  );
  private workspaceMemberRepo = AppDataSource.getRepository(
    WorkspaceMembersEntity,
  );

  async findConversationIds(userId: string) {
    const rows = await this.participantRepo.find({
      where: { user: { id: userId } },
      relations: ["conversation"],
    });

    return rows.map((r) => r.conversation.id);
  }

  async getDMConversations(userId: string, workspaceId: string) {
    const workspaceMembers = await this.workspaceMemberRepo
      .createQueryBuilder("wm")
      .leftJoinAndSelect("wm.user", "user")
      .where("wm.workspaceId = :workspaceId", { workspaceId })
      .andWhere("user.id != :userId", { userId })
      .getMany();

    const conversations = await this.conversationRepo
      .createQueryBuilder("conversation")
      .innerJoin("conversation.participants", "cp")
      .innerJoin("cp.user", "user")
      .where("cp.user = :userId", { userId })
      .andWhere("conversation.workspaceId = :workspaceId", {
        workspaceId,
      })
      .andWhere("conversation.type = :type", {
        type: ConversationTypeEnum.DM,
      })
      .leftJoinAndSelect("conversation.participants", "participants")
      .leftJoinAndSelect("participants.user", "participantUser")
      .getMany();

    const conversationMap = new Map();

    conversations.forEach((conv) => {
      const otherUser = conv.participants.find(
        (p) => p.user.id !== userId,
      )?.user;

      if (otherUser) {
        conversationMap.set(otherUser.id, conv);
      }
    });

    return workspaceMembers.map((member) => {
      const user = member.user;

      const existingConversation = conversationMap.get(user.id);

      return {
        userId: user.id,
        displayName: `${user.first_name} ${user.last_name}`,
        avatar: user.avatar,
        hasConversation: !!existingConversation,
        conversationId: existingConversation?.id || null,
        type: ConversationTypeEnum.DM,
      };
    });
  }

  async getGroupConversations(userId: string, workspaceId: string) {
    const conversations = await this.conversationRepo
      .createQueryBuilder("conversation")
      .innerJoin("conversation.participants", "cp")
      .innerJoin("cp.user", "user")
      .where("cp.user = :userId", { userId })
      .andWhere("conversation.workspaceId = :workspaceId", {
        workspaceId,
      })
      .andWhere("conversation.type = :type", {
        type: ConversationTypeEnum.GROUP,
      })
      .leftJoinAndSelect("conversation.participants", "participants")
      .leftJoinAndSelect("participants.user", "participantUser")
      .orderBy("conversation.created_at", "DESC")
      .getMany();

    return conversations.map((conv) => ({
      conversationId: conv.id,

      type: conv.type,

      displayName: conv.name,

      // users: conv.participants.map((p) => ({
      //   id: p.user.id,
      //   name: `${p.user.first_name} ${p.user.last_name}`,
      //   email: p.user.email,
      //   avatar: p.user.avatar,
      // })),
    }));
  }

  async getConversationDetails(conversationId: string, userId: string) {
    const conversation = await this.conversationRepo.findOne({
      where: { id: conversationId },
    });

    if (!conversation) {
      throw new Error("Conversation does not exist!");
    }
    const result = await this.conversationRepo
      .createQueryBuilder("conversation")
      .leftJoinAndSelect("conversation.participants", "participant")
      .leftJoinAndSelect("participant.user", "user")
      .select([
        "conversation.id",
        "conversation.type",
        "conversation.name",
        "participant.id",
        "participant.role",
        "user.id",
        "user.email",
        "user.first_name",
        "user.last_name",
      ])
      .where("conversation.id = :conversationId", { conversationId })
      .andWhere(
        new Brackets((qb) => {
          qb.where("conversation.type != :type", {
            type: ConversationTypeEnum.DM,
          }).orWhere("conversation.type = :type AND user.id != :userId", {
            type: ConversationTypeEnum.DM,
            userId,
          });
        }),
      )
      .getOne();

    const filteredConversation = {
      ...result,
      participants: result?.participants.map((participant) => ({
        id: participant.id,
        userId: participant.user.id,
        first_name: participant.user.first_name,
        last_name: participant.user.last_name,
        email: participant.user.email,
        role: participant.role,
      })),
    };

    return filteredConversation;
  }

  async createConversation(payload: CreateConversationDto) {
    return await AppDataSource.transaction(async (manager) => {
      const conversationRepo = manager.getRepository(ConversationEntity);

      const participantRepo = manager.getRepository(
        ConversationParticipantEntity,
      );

      const members = [...payload.conversation_members, payload.creator_id];

      const dmKey = members.sort().join("_");

      // ================= DM =================

      if (payload.type === ConversationTypeEnum.DM) {
        const existing = await conversationRepo.findOne({
          where: { dmKey },
        });

        if (existing) {
          throw new Error("Conversation already exists");
        }

        const conversation = conversationRepo.create({
          ...payload,
          name: null,
          dmKey,
          workspace: { id: payload.workspaceId },
        });

        const savedConversation = await conversationRepo.save(conversation);

        const participants = members.map((userId) =>
          participantRepo.create({
            conversation: { id: savedConversation.id },
            user: { id: userId },
          }),
        );

        await participantRepo.save(participants);

        return {
          message: "Chat created successfully",
          conversation: savedConversation,
        };
      }

      // ================= GROUP =================

      if (payload.type === ConversationTypeEnum.GROUP) {
        const conversation = conversationRepo.create({
          ...payload,
          workspace: { id: payload.workspaceId },
        } as DeepPartial<ConversationEntity>);

        const savedConversation = await conversationRepo.save(conversation);

        const participants = members.map((userId) =>
          participantRepo.create({
            role:
              userId === payload.creator_id
                ? ConversationParticipantRoleEnum.ADMIN
                : ConversationParticipantRoleEnum.MEMBER,

            conversation: { id: savedConversation.id },
            user: { id: userId },
          }),
        );

        await participantRepo.save(participants);

        return {
          message: "Group created successfully",
          conversation: savedConversation,
        };
      }

      throw new Error("Invalid conversation type");
    });
  }
}
