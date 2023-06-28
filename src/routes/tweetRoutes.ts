import { Router } from "express";
import { PrismaClient } from "@prisma/client";
const router = Router();
const prisma = new PrismaClient();
// create tweet
router.post("/", async (req, res) => {
  const { content, image } = req.body;
  //@ts-ignore
  const user = req.user;
  try {
    const result = await prisma.tweet.create({
      data: {
        content,
        image,
        userId: user.id,
      },
      include: {
        user: true,
      },
    });
    res.json(result);
  } catch (e) {
    res.status(400).json({ error: "No user with the given id" });
  }
});
// get list of tweets
router.get("/", async (req, res) => {
  const allTweets = await prisma.tweet.findMany({
    include: {
      user: {
        select: {
          id: true,
          name: true,
          username: true,
          image: true,
        },
      },
    },
  });
  res.json(allTweets);
});
// get a tweet
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  const tweet = await prisma.tweet.findUnique({
    where: { id: Number(id) },
    include: { user: true },
  });
  if (!tweet) return res.status(404).json({ error: "tweet not found" });
  // setTimeout(() => res.json(tweet), 2000);
  // console.log("fetching the tweet:" + id);
  res.json(tweet);
});
// update the tweet
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { content, image } = req.body;
  try {
    const result = await prisma.tweet.update({
      where: {
        id: Number(id),
      },
      data: {
        image,
        content,
      },
    });
    res.json(result);
  } catch (e) {
    res.status(400).json({ error: "could not update the tweet" });
  }
});
// delete the tweet
router.post("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.tweet.delete({ where: { id: Number(id) } });
    res.sendStatus(200);
  } catch (e) {
    res.status(400).json({ error: "Cannot delete the tweet" });
  }
});
export default router;
