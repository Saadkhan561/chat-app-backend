import { RequestUserObject } from "../../interfaces/common.js";
import jwt from "jsonwebtoken";

export const decodeJwt = (token: string): RequestUserObject => {
  const decoded = jwt.verify(
    token,
    process.env.JWT_SECRET as string,
  ) as RequestUserObject;
  return decoded;
};
