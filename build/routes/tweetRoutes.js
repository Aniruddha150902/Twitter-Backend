"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const client_1 = require("@prisma/client");
const router = (0, express_1.Router)();
const prisma = new client_1.PrismaClient();
// create tweet
router.post("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { content, image } = req.body;
    //@ts-ignore
    const user = req.user;
    console.log(user);
    try {
        const result = yield prisma.tweet.create({
            data: {
                content,
                image,
                userId: user.id,
            },
            include: {
                user: true,
            },
        });
        // console.log(res.json);
        return res.status(200).json(result);
    }
    catch (e) {
        return res.status(400).json({ error: "Error Posting the Tweet" });
    }
}));
// get list of tweets
router.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const allTweets = yield prisma.tweet.findMany({
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
    return res.json(allTweets);
}));
// get a tweet
router.get("/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const tweet = yield prisma.tweet.findUnique({
            where: { id: Number(id) },
            include: { user: true },
        });
        return res.json(tweet);
    }
    catch (e) {
        return res.status(404).json({ error: "tweet not found" });
    }
    // setTimeout(() => res.json(tweet), 2000);
    // console.log("fetching the tweet:" + id);
}));
// update the tweet
router.put("/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { content, image } = req.body;
    try {
        const result = yield prisma.tweet.update({
            where: {
                id: Number(id),
            },
            data: {
                image,
                content,
            },
        });
        res.json(result);
    }
    catch (e) {
        res.status(400).json({ error: "could not update the tweet" });
    }
}));
// delete the tweet
router.post("/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        yield prisma.tweet.delete({ where: { id: Number(id) } });
        res.sendStatus(200);
    }
    catch (e) {
        res.status(400).json({ error: "Cannot delete the tweet" });
    }
}));
exports.default = router;
