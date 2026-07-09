import { Request, Response } from "express";
import { ReqObject } from "../../interfaces/common.js";
import { ConversationsService } from "./conversations.service.js";

const conversation = new ConversationsService();

export const getDMConversations = async (req: ReqObject, res: Response) => {
  try {
    const { workspaceId } = req.params;

    const conversations = await conversation.getDMConversations(
      req.user?.userId ?? "",
      workspaceId as string,
    );

    return res.status(200).json(conversations);
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch DM conversations",
    });
  }
};

export const getGroupConversations = async (req: ReqObject, res: Response) => {
  try {
    const { workspaceId } = req.params;

    const conversations = await conversation.getGroupConversations(
      req.user?.userId ?? "",
      workspaceId as string,
    );

    return res.status(200).json(conversations);
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch group conversations",
    });
  }
};

export const getConversationDetails = async (req: ReqObject, res: Response) => {
  try {
    const result = await conversation.getConversationDetails(
      req.params.conversationId as string,
      req.user?.userId ?? "",
    );
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch conversation details",
    });
  }
};

export const createConversation = async (req: Request, res: Response) => {
  try {
    const data = await conversation.createConversation(req.body);
    res.json(data);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};
