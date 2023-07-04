import { Router } from "express";
import { PrismaClient } from "@prisma/client";
const router = Router();
const prisma = new PrismaClient();
// create user
router.post("/", async (req, res) => {
  const { email, name, username, bio } = req.body;
  try {
    const result = await prisma.user.create({
      data: {
        email,
        name,
        username,
        bio,
      },
    });
    res.json(result);
  } catch (e) {
    res.status(400).json({ error: "Wrong Input Data" });
  }
});
// list all users
router.get("/list", async (req, res) => {
  const allUsers = await prisma.user.findMany();
  res.json(allUsers);
});
// user details
router.get("/:id", async (req, res) => {
  // or only id
  const { id } = req.params;
  const user = await prisma.user.findUnique({
    where: { id: Number(id) },
    include: {
      tweet: {
        select: {
          id: true,
          content: true,
          image: true,
          createdAt: true,
          updatedAt: true,
          impression: true,
          userId: true,
          user: true,
        },
      },
    },
  });
  if (!user)
    return res.status(404).json({ error: "No user with the id : " + id });
  res.json(user);
});

router.get("/", async (req, res) => {
  const user = req.body;
  // console.log(user);
  return res.json(user);
});

// update user
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { name, image, bio } = req.body;
  try {
    const result = await prisma.user.update({
      where: {
        id: Number(id),
      },
      data: {
        image,
        name,
        bio,
      },
    });
    res.json(result);
  } catch (e) {
    res.status(400).json({ error: "could not update the user" });
  }
});
// delete user
router.post("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.user.delete({ where: { id: Number(id) } });
    res.sendStatus(200);
  } catch (e) {
    res.status(400).json({ error: "Cannot delete the user" });
  }
});
export default router;
