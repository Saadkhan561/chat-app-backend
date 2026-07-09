import { Request, Response } from "express";
import { ReqObject } from "../../interfaces/common.js";
import { BookmarksService } from "./bookmarks.service.js";

const bookmarks = new BookmarksService();

export const createBookmark = async (req: ReqObject, res: Response) => {
  try {
    const data = await bookmarks.createBookmark(
      req.user?.userId ?? "",
      req.body,
    );
    res.json(data);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteBookmark = async (req: Request, res: Response) => {
  const id = req.params.id;

  try {
    const data = await bookmarks.deleteBookmark(id as string);
    res.json(data);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const getBookmarks = async (req: ReqObject, res: Response) => {
  const { limit = 10, offset = 0 } = req.query;
  try {
    const data = await bookmarks.getBookmarks(
      req.user?.userId ?? "",
      Number(limit),
      Number(offset),
    );
    res.json(data);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};
