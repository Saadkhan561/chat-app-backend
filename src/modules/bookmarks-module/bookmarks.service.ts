import { AppDataSource } from "../../config/data-source.js";
import { CreateBookmarkDto } from "../../dto/bookmarks.dto.js";
import { ConversationTypeEnum } from "../../enum/conversations.enum.js";
import { CreateBookmarkResponse } from "../../interfaces/bookmarks.interface.js";
import { BookmarksEntity } from "./bookmarks.entity.js";

export class BookmarksService {
  private bookmarksRepo = AppDataSource.getRepository(BookmarksEntity);

  async createBookmark(
    userId: string,
    payload: CreateBookmarkDto,
  ): Promise<CreateBookmarkResponse> {
    const existingBookmark = await this.bookmarksRepo.findOne({
      where: {
        message: { id: payload.messageId },
        user: { id: userId },
      },
      relations: ["message", "user"],
    });

    if (existingBookmark) {
      throw new Error("Message already bookmarked");
    }

    const newBookmark = this.bookmarksRepo.create({
      user: { id: userId },
      message: { id: payload.messageId },
    });

    const result = await this.bookmarksRepo.save(newBookmark);

    return {
      bookmarkId: result.id,
      messageId: result.message.id,
      userId: result.user.id,
    };
  }

  async getBookmarks(userId: string, limit: number, offset: number) {
    const [bookmarks, count] = await this.bookmarksRepo
      .createQueryBuilder("bookmarks")
      .leftJoinAndSelect("bookmarks.message", "message")
      .leftJoinAndSelect("message.attachments", "attachment")
      .leftJoinAndSelect("message.conversation", "conversation")
      .leftJoinAndSelect("message.sender", "sender")
      // .leftJoinAndSelect("conversation.participants", "participants")
      // .leftJoinAndSelect("participants.user", "user")
      .select([
        "bookmarks.id",
        "bookmarks.created_at",
        "conversation.name",
        "conversation.type",
        "message.id",
        "message.content",
        "message.created_at",
        "sender.id",
        "sender.first_name",
        "sender.last_name",
        "sender.avatar",
        "attachment.fileUrl",
        // "participants.id",
        // "user.id",
        // "user.first_name",
        // "user.last_name",
        // "user.avatar",
      ])
      .where("bookmarks.user = :userId", { userId })
      .limit(limit)
      .offset(offset)
      .orderBy("bookmarks.created_at", "DESC")
      .getManyAndCount();

    const result = bookmarks.map((bookmark) => {
      const { participants, ...conversationWithoutParticipants } =
        bookmark.message.conversation;

      return {
        ...bookmark,
        message: {
          messageId: bookmark.message.id,
          content: bookmark.message.content,
          messageCreatedAt: bookmark.message.created_at,
          senderId: bookmark.message.sender.id,
          senderFirstName: bookmark.message.sender.first_name,
          senderLastName: bookmark.message.sender.last_name,
          senderAvatar: bookmark.message.sender.avatar,
          attachments: bookmark.message.attachments,
          conversation: {
            ...conversationWithoutParticipants,
            // displayName:
            //   bookmark.message.conversation.type === ConversationTypeEnum.DM
            //     ? (() => {
            //         const otherParticipant =
            //           bookmark.message.conversation.participants.find(
            //             (participant) => participant.user.id !== userId,
            //           );

            //         return otherParticipant
            //           ? `${otherParticipant.user.first_name} ${otherParticipant.user.last_name}`
            //           : null;
            //       })()
            //     : null,
          },
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

  async deleteBookmark(bookmarkId: string): Promise<{ message: string }> {
    const bookmark = await this.bookmarksRepo.findOne({
      where: { id: bookmarkId },
    });

    if (!bookmark) {
      throw new Error("Bookmark does not exist!");
    }

    await this.bookmarksRepo.delete(bookmark.id);

    return { message: "Bookmark removed successfully!" };
  }
}
