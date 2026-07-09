import { AppDataSource } from "../../config/data-source.js";
import { CreateMessageDto, UpdateMessageDto } from "../../dto/message.dto.js";
import { AttachmentEntity } from "./entity/attachment.entity.js";
import { MessageEntity } from "./entity/message.entity.js";

export class MessageService {
  private messageRepository = AppDataSource.getRepository(MessageEntity);
  private attachmentRepo = AppDataSource.getRepository(AttachmentEntity);

  async createMessage(payload: CreateMessageDto) {
    return await AppDataSource.transaction(async (manager) => {
      const messageRepo = manager.getRepository(MessageEntity);
      const attachmentRepo = manager.getRepository(AttachmentEntity);

      const message = messageRepo.create({
        content: payload.content,
        type: payload.type,
        status: payload.status,
        conversation: { id: payload.conversation_id },
        sender: { id: payload.sent_by },
      });

      const newMessage = await this.messageRepository.save(message);

      if (payload.attachments) {
        const newAttachments =
          payload.attachments?.map((attachment) => {
            return attachmentRepo.create({
              ...attachment,
              message: { id: newMessage.id },
            });
          }) ?? [];

        const savedAttachments = await attachmentRepo.save(newAttachments);

        return {
          ...newMessage,
          attachments: savedAttachments,
        };
      }

      return newMessage;
    });
  }

  async getMessagesByConversation(
    limit: number,
    offset: number,
    conversationId: string,
  ) {
    const [messages, count] = await this.messageRepository
      .createQueryBuilder("message")
      .leftJoin("message.conversation", "conversation")
      .leftJoin("message.sender", "user")
      .leftJoin("message.bookmarks", "bookmarks")
      .leftJoinAndSelect("message.parentMessage", "parentMessage")
      .leftJoinAndSelect("parentMessage.sender", "parentMessageSender")
      .leftJoin("bookmarks.user", "bookmarkUser")
      .leftJoinAndSelect("message.pinned", "pinnedMessages")
      .leftJoinAndSelect("pinnedMessages.pinnedBy", "pinnedUser")
      .select([
        "message.id",
        "message.content",
        "message.type",
        "message.status",
        "message.read_at",
        "message.read_by",
        "message.senderId",
        "message.created_at",
        "user.id",
        "user.first_name",
        "user.last_name",
        "user.email",
        "conversation.id",
        "conversation.name",
        "conversation.type",
        "bookmarks.id",
        "bookmarkUser.id",
        "pinnedMessages.id",
        "pinnedUser.id",
        "parentMessage.id",
        "parentMessage.content",
        "parentMessage.type",
        "parentMessage.status",
        "parentMessage.read_at",
        "parentMessage.read_by",
        "parentMessage.senderId",
        "parentMessage.created_at",
        "parentMessageSender.id",
        "parentMessageSender.first_name",
        "parentMessageSender.last_name",
        "parentMessageSender.email",
      ])
      .where("message.conversation = :conversationId", {
        conversationId,
      })
      .limit(limit)
      .offset(offset)
      .orderBy("message.created_at", "DESC")
      .getManyAndCount();

    const filteredMessages = messages.map((msg) => {
      return {
        msgId: msg.id,
        msgContent: msg.content,
        msgType: msg.type,
        msgStatus: msg.status,
        msgReadAt: msg.read_at,
        msgReadBy: msg.read_by,
        createdAt: msg.created_at,
        conversationId: msg.conversation.id,
        conversationName: msg.conversation.name,
        conversationType: msg.conversation.type,
        senderId: msg.sender.id,
        senderFirstName: msg.sender.first_name,
        senderLastName: msg.sender.last_name,
        senderEmail: msg.sender.email,
        bookmarks: msg.bookmarks.map((bookmark) => {
          return {
            bookmarkId: bookmark.id,
            bookmarkUser: bookmark.user.id,
          };
        }),
        pinnedMessages: msg.pinned.map((msg) => {
          return {
            pinnedId: msg.id,
            pinnedById: msg.pinnedBy.id,
          };
        }),
        parentMessage: msg.parentMessage
          ? {
              id: msg.parentMessage.id,
              content: msg.parentMessage.content,
              type: msg.parentMessage.type,
              status: msg.parentMessage.status,
              readAt: msg.parentMessage.read_at,
              readBy: msg.parentMessage.read_by,
              createdAt: msg.parentMessage.created_at,

              senderId: msg.parentMessage.sender.id,
              senderFirstName: msg.parentMessage.sender.first_name,
              senderLastName: msg.parentMessage.sender.last_name,
              senderEmail: msg.parentMessage.sender.email,
            }
          : null,
      };
    });

    const totalPages = Math.ceil(count / limit);
    const pageNo = offset / limit + 1;

    return {
      messages: filteredMessages,
      pagination: {
        limit,
        offset,
        pageNo,
        totalPages,
        total: count,
      },
    };
  }

  async updateMessage(userId: string, id: string, payload: UpdateMessageDto) {
    const message = await this.messageRepository.findOne({
      where: {
        id,
      },
      relations: ["sender", "attachments"], //future use for updating attachments
    });

    if (!message) {
      throw new Error("Message not found");
    }

    if (message.sender.id === userId) {
      message.content = payload.content;
      // if(payload.attachments){} for fututre use

      await this.messageRepository.save(message);
      return { message: "Message updated successfully" };
    } else {
      throw new Error("Message can only be updated by its owner");
    }
  }

  async createMessageReply(messageId: string, payload: CreateMessageDto) {
    return await AppDataSource.transaction(async (manager) => {
      const existingMessage = await this.messageRepository.findOne({
        where: { id: messageId },
      });

      if (!existingMessage) {
        throw new Error("Message does not exist");
      }

      const messageRepo = manager.getRepository(MessageEntity);
      const attachmentRepo = manager.getRepository(AttachmentEntity);

      const message = messageRepo.create({
        content: payload.content,
        type: payload.type,
        status: payload.status,
        conversation: { id: payload.conversation_id },
        sender: { id: payload.sent_by },
        parentMessage: { id: messageId },
      });

      const newMessage = await this.messageRepository.save(message);

      if (payload.attachments) {
        const newAttachments =
          payload.attachments?.map((attachment) => {
            return attachmentRepo.create({
              ...attachment,
              message: { id: newMessage.id },
            });
          }) ?? [];

        const savedAttachments = await attachmentRepo.save(newAttachments);

        return {
          ...newMessage,
          attachments: savedAttachments,
        };
      }

      return newMessage;
    });
  }
}
