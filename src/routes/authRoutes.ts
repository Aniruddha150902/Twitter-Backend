import { Router } from "express";
import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";
const router = Router();
const prisma = new PrismaClient();
const EMAIL_TOKEN_EXPIRATION_MINUTES = 10;
const AUTHENTICATION_EXPIRATION_HOURS = 12;
const JWT_TOKEN = "SUPER SECRET";
function generateEmialToken() {
  return Math.floor(10000000 + Math.random() * 90000000).toString();
}
function generateApiToken(tokenId: Number) {
  const TokenId = tokenId.toString();
  const jwtPayload = { TokenId };
  return jwt.sign(jwtPayload, JWT_TOKEN, {
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
  if (!dbEmailToken || !dbEmailToken.valid) res.sendStatus(401);
  if (!dbEmailToken || dbEmailToken.expired < new Date())
    res.status(401).json({ error: "Token Expired" });
  if (dbEmailToken?.user.email != email) res.sendStatus(401);
  const expired = new Date(
    new Date().getTime() + AUTHENTICATION_EXPIRATION_HOURS * 60 * 60 * 1000
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
  res.json({ authcode });
});
export default router;