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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const client_1 = require("@prisma/client");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const emailService_1 = require("../services/emailService");
const router = (0, express_1.Router)();
const prisma = new client_1.PrismaClient();
const EMAIL_TOKEN_EXPIRATION_MINUTES = 10;
const AUTHENTICATION_EXPIRATION_HOURS = 24;
const JWT_SECRET = process.env.JWT_SECRET || "SUPER SECRET";
function generateEmialToken() {
    return Math.floor(10000000 + Math.random() * 90000000).toString();
}
function generateApiToken(tokenId) {
    const TokenId = tokenId;
    const jwtPayload = { TokenId };
    return jsonwebtoken_1.default.sign(jwtPayload, JWT_SECRET, {
        algorithm: "HS256",
        noTimestamp: true,
    });
}
// create user
router.post("/create", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, name, username, bio, image } = req.body;
    try {
        const result = yield prisma.user.create({
            data: {
                email,
                name,
                username,
                bio,
                image,
            },
        });
        res.json(result);
    }
    catch (e) {
        res.status(400).json({ error: "Wrong Input Data" });
    }
}));
router.post("/login", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = req.body;
    const emailToken = generateEmialToken();
    const expired = new Date(new Date().getTime() + EMAIL_TOKEN_EXPIRATION_MINUTES * 60 * 1000);
    try {
        const createdToken = yield prisma.token.create({
            data: {
                type: "EMAIL",
                emailToken,
                expired,
                user: {
                    connect: {
                        email,
                    },
                },
            },
        });
        console.log(createdToken);
        yield (0, emailService_1.sendEmailToken)(email, emailToken);
        return res.sendStatus(200);
    }
    catch (e) {
        console.log(e);
        return res.status(400).json({ error: "Please Create an Account" });
    }
}));
router.post("/authentication", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, emailToken } = req.body;
    const dbEmailToken = yield prisma.token.findUnique({
        where: { emailToken },
        include: {
            user: true,
        },
    });
    if (!dbEmailToken || !dbEmailToken.valid)
        return res.sendStatus(401);
    if (!dbEmailToken || dbEmailToken.expired < new Date())
        return res.status(401).json({ error: "Token Expired" });
    if ((dbEmailToken === null || dbEmailToken === void 0 ? void 0 : dbEmailToken.user.email) != email)
        return res.sendStatus(401);
    const expired = new Date(new Date().getTime() + 5 * AUTHENTICATION_EXPIRATION_HOURS * 60 * 60 * 1000);
    const apiToken = yield prisma.token.create({
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
    yield prisma.token.update({
        where: {
            emailToken,
        },
        data: {
            valid: false,
        },
    });
    const authcode = generateApiToken(apiToken.id);
    console.log(authcode);
    return res.status(200).json({ authcode });
}));
exports.default = router;
