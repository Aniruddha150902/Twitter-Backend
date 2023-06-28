import { Router } from "express";
import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";
import { sendEmailToken } from "../services/emailService";
const router = Router();
const prisma = new PrismaClient();
const EMAIL_TOKEN_EXPIRATION_MINUTES = 10;
const AUTHENTICATION_EXPIRATION_HOURS = 24;
const JWT_SECRET = process.env.JWT_SECRET || "SUPER SECRET";
function generateEmialToken() {
  return Math.floor(10000000 + Math.random() * 90000000).toString();
}
function generateApiToken(tokenId: number): string {
  const TokenId = tokenId;
  const jwtPayload = { TokenId };
  return jwt.sign(jwtPayload, JWT_SECRET, {
    algorithm: "HS256",
    noTimestamp: true,
  });
}
router.post("/login", async (req, res) => {
  const { email } = req.body;
  const emailToken = generateEmialToken();
  const expired = new Date(
    new Date().getTime() + EMAIL_TOKEN_EXPIRATION_MINUTES * 60 * 1000
  );
  try {
    const createdToken = await prisma.token.create({
      data: {
        type: "EMAIL",
        emailToken,
        expired,
        user: {
          connectOrCreate: {
            where: {
              email,
            },
            create: {
              email,
            },
          },
        },
      },
    });
    console.log(createdToken);
    await sendEmailToken(email, emailToken);
    res.sendStatus(200);
  } catch (e) {
    console.log(e);
    res
      .status(400)
      .json({ error: "Couldn't Start the Authentication Process." });
  }
});
router.post("/authentication", async (req, res) => {
  const { email, emailToken } = req.body;
  const dbEmailToken = await prisma.token.findUnique({
    where: { emailToken },
    include: {
      user: true,
    },
  });
  if (!dbEmailToken || !dbEmailToken.valid) return res.sendStatus(401);
  if (!dbEmailToken || dbEmailToken.expired < new Date())
    return res.status(401).json({ error: "Token Expired" });
  if (dbEmailToken?.user.email != email) return res.sendStatus(401);
  const expired = new Date(
    new Date().getTime() + 5 * AUTHENTICATION_EXPIRATION_HOURS * 60 * 60 * 1000
  );
  const apiToken = await prisma.token.create({
    data: {
      type: "API",
      expired,
      user: {
        connect: {
          email,
        },
      },
    },
  });
  await prisma.token.update({
    where: {
      emailToken,
    },
    data: {
      valid: false,
    },
  });
  const authcode = generateApiToken(apiToken.id);
  console.log(authcode);
  res.status(200).json({ authcode });
});
export default router;
