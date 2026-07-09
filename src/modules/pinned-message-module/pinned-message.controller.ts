import { Request, Response } from "express";
import { ReqObject } from "../../interfaces/common.js";
import { PinnedMessageService } from "./pinned-message.service.js";

const pinnedService = new PinnedMessageService();

export const getPinnedMessages = async (req: ReqObject, res: Response) => {
  try {
    const { conversationId } = req.params;
    const { limit = 10, offset = 0 } = req.query;
    const data = await pinnedService.getPinnedMessages(
      conversationId as string,
      Number(limit),
      Number(offset),
    );
    res.json(data);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const createPinnedMessage = async (req: ReqObject, res: Response) => {
  try {
    const data = await pinnedService.createPinnedMessage({
      ...req.body,
      pinned_by: req.user?.userId ?? "",
    });
    res.json(data);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const deletePinnedMessage = async (req: Request, res: Response) => {
  const id = req.params.id;

  try {
    const data = await pinnedService.deletePinnedMessage(id as string);
    res.json(data);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};
