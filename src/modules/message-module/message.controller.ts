import { Request, Response } from "express";
import { MessageService } from "./message.service.js";
import { ReqObject } from "../../interfaces/common.js";

const service = new MessageService();

export class MessageController {
  async createMessage(req: Request, res: Response) {
    try {
      const data = await service.createMessage(req.body);
      res.json(data);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  async createMessageReply(req: Request, res: Response) {
    const { messageId } = req.params;

    try {
      const data = await service.createMessageReply(
        messageId as string,
        req.body,
      );
      res.json(data);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  async getMessagesByConversation(req: ReqObject, res: Response) {
    try {
      const { conversationId } = req.params;
      const { limit = 10, offset = 0 } = req.query;

      const data = await service.getMessagesByConversation(
        Number(limit),
        Number(offset),
        conversationId as string,
      );

      res.json(data);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  async updateMessage(req: ReqObject, res: Response) {
    try {
      const { id } = req.params;

      const data = await service.updateMessage(
        req.user?.userId ?? "",
        id as string,
        req.body,
      );

      res.json(data);
    } catch (error: any) {
      res.status(400).json({
        message: error.message,
      });
    }
  }
}
