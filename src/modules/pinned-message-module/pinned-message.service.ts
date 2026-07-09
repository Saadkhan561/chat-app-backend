import { AppDataSource } from "../../config/data-source.js";
import { CreatePinnedMessageDto } from "../../dto/pinned-message.dto.js";
import { CreatePinnedMessageResponse } from "../../interfaces/pinned.interface.js";
import { PinnedMessagEntity } from "./pinned-message.entity.js";

export class PinnedMessageService {
  private pinnedRepo = AppDataSource.getRepository(PinnedMessagEntity);

  async getPinnedMessages(
    conversationId: string,
    limit: number,
    offset: number,
  ) {
    const [pinnedMessages, count] = await this.pinnedRepo
      .createQueryBuilder("pm")
      .leftJoinAndSelect("pm.message", "message")
      .leftJoinAndSelect("message.attachments", "attachment")
      .leftJoinAndSelect("message.sender", "sender")
      .leftJoinAndSelect("pm.pinnedBy", "pinnedByUser")
      .select([
        "pm.id",
        "message.id",
        "message.content",
        "message.created_at",
        "sender.id",
        "sender.first_name",
        "sender.last_name",
        "sender.avatar",
        "pinnedByUser.id",
        "pinnedByUser.first_name",
        "pinnedByUser.last_name",
        "pinnedByUser.avatar",
        "pinnedByUser.created_at",
        "attachment.fileUrl",
      ])
      .where("pm.conversation = :conversationId", { conversationId })
      .limit(limit)
      .offset(offset)
      .orderBy("pm.created_at", "DESC")
      .getManyAndCount();

    const result = pinnedMessages.map((pinned: PinnedMessagEntity) => {
      return {
        ...pinned,
        message: {
          messageId: pinned.message.id,
          content: pinned.message.content,
          messageCreatedAt: pinned.message.created_at,
          senderId: pinned.message.sender.id,
          senderFirstName: pinned.message.sender.first_name,
          senderLastName: pinned.message.sender.last_name,
          senderAvatar: pinned.message.sender.avatar,
          attachments: pinned.message.attachments,
        },
      };
    });

    const totalPages = Math.ceil(count / limit);
    const pageNo = offset / limit + 1;

    return {
      result,
      pagination: {
        limit,
        offset,
        pageNo,
        totalPages,
        total: count,
      },
    };
  }

  async createPinnedMessage(
    payload: CreatePinnedMessageDto,
  ): Promise<CreatePinnedMessageResponse> {
    const existingPinnedMessage = await this.pinnedRepo.findOne({
      where: {
        conversation: { id: payload.conversationId },
        message: { id: payload.messageId },
        pinnedBy: { id: payload.pinned_by },
      },
    });

    if (existingPinnedMessage) {
      throw new Error("Message already pinned");
    }

    const pinned = this.pinnedRepo.create({
      conversation: { id: payload.conversationId },
      message: { id: payload.messageId },
      pinnedBy: { id: payload.pinned_by },
    });

    const result = await this.pinnedRepo.save(pinned);

    return {
      id: result.id,
      pinnedBy: result.pinnedBy.id,
    };
  }

  async deletePinnedMessage(pinnedId: string): Promise<{ message: string }> {
    const pinned = await this.pinnedRepo.findOne({
      where: { id: pinnedId },
    });

    if (!pinned) {
      throw new Error("Pinned message does not exist!");
    }

    await this.pinnedRepo.delete(pinned.id);

    return { message: "Pinned message removed successfully!" };
  }
}
