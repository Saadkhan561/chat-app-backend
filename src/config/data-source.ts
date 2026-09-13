import "reflect-metadata";
import { DataSource } from "typeorm";
import "dotenv/config";
import { WorkedHoursEntity } from "../modules/worked-hours-module/worked-hours.entity.js";
import { ProjectEntity } from "../modules/project-module/project.entity.js";
import { ConversationEntity } from "../modules/conversations-module/entity/conversations.entity.js";
import { MessageEntity } from "../modules/message-module/entity/message.entity.js";
import { ConversationParticipantEntity } from "../modules/conversations-module/entity/conversation-participants.entity.js";
import { UserEntity } from "../modules/user-module/user.entity.js";
import { WorkspaceEntity } from "../modules/workspace-module/entity/workspace.entity.js";
import { AttachmentEntity } from "../modules/message-module/entity/attachment.entity.js";
import { BookmarksEntity } from "../modules/bookmarks-module/bookmarks.entity.js";
import { PinnedMessagEntity } from "../modules/pinned-message-module/pinned-message.entity.js";
import { WorkspaceMembersEntity } from "../modules/workspace-module/entity/workspace-members.entity.js";
import { fileURLToPath } from "node:url";
import path from "node:path";

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing environment variable: ${name}`);
  }
  return value;
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const AppDataSource = new DataSource({
  type: "postgres",
  url: requireEnv("DATABASE_URL"),

  entities: [
    UserEntity,
    WorkedHoursEntity,
    WorkspaceEntity,
    WorkspaceMembersEntity,
    ProjectEntity,
    ConversationEntity,
    MessageEntity,
    AttachmentEntity,
    ConversationParticipantEntity,
    BookmarksEntity,
    PinnedMessagEntity,
  ],
  // migrations: ["src/migrations/**/*.{ts,js}"],
  migrations: [path.join(__dirname, "../migrations/*.{js,ts}")],

  synchronize: true,
  logging: true,
});
