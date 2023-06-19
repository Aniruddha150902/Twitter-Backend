import { Request, Response, NextFunction } from "express";
import { PrismaClient, User } from "@prisma/client";
import jwt from "jsonwebtoken";
const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || "SUPER SECRET";
console.log(JWT_SECRET);
type authRequest = Request & { user?: User };
const authenticationLayer = async (
  req: authRequest,
  res: Response,
  next: NextFunction
) => {
  const authCode = req.headers.authorization;
  const jwtAuthCode = authCode?.split(" ")[1];
  if (!jwtAuthCode) res.sendStatus(400);
  try {
    const jwtPayload = jwt.verify(jwtAuthCode as string, JWT_SECRET) as {
      TokenId: number;
    };
    const dbToken = await prisma.token.findUnique({
      where: {
        id: jwtPayload.TokenId,
      },
      include: {
        user: true,
      },
    });
    if (!dbToken || !dbToken.valid || dbToken.expired < new Date())
      res.status(400).json({ error: "Authenticaton Token Expired!" });
    req.user = dbToken?.user;
  } catch (e) {
    console.error(e);
    res.sendStatus(400);
  }
  next();
};
export default authenticationLayer;
