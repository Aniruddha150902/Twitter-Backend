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
// create user
router.post("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, name, username, bio } = req.body;
    try {
        const result = yield prisma.user.create({
            data: {
                email,
                name,
                username,
                bio,
            },
        });
        res.json(result);
    }
    catch (e) {
        res.status(400).json({ error: "Wrong Input Data" });
    }
}));
// list all users
router.get("/list", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const allUsers = yield prisma.user.findMany();
    res.json(allUsers);
}));
// user details
router.get("/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // or only id
    const { id } = req.params;
    const user = yield prisma.user.findUnique({
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
}));
router.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //@ts-ignore
    const user = req.user;
    return res.json(user);
}));
// update user
router.put("/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { name, image, bio } = req.body;
    try {
        const result = yield prisma.user.update({
            where: {
                id: Number(id),
            },
            data: {
                image,
                name,
                bio,
            },
        });
        // console.log(res);
        return res.json(result);
    }
    catch (e) {
        // console.log(res);
        return res.status(400).json({ error: "could not update the user" });
    }
}));
// delete user
router.post("/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        yield prisma.user.delete({ where: { id: Number(id) } });
        res.sendStatus(200);
    }
    catch (e) {
        res.status(400).json({ error: "Cannot delete the user" });
    }
}));
exports.default = router;
