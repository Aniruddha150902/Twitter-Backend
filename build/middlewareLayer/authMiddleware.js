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
const client_1 = require("@prisma/client");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const prisma = new client_1.PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || "SUPER SECRET";
const authenticationLayer = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const authCode = req.headers.authorization;
    if (!authCode)
        return res.sendStatus(401);
    const jwtAuthCode = authCode === null || authCode === void 0 ? void 0 : authCode.split(" ")[1];
    try {
        const jwtPayload = jsonwebtoken_1.default.verify(jwtAuthCode, JWT_SECRET);
        const dbToken = yield prisma.token.findUnique({
            where: {
                id: jwtPayload.TokenId,
            },
            include: {
                user: true,
            },
        });
        if (!dbToken || !dbToken.valid || dbToken.expired < new Date())
            return res.status(400).json({ error: "Authenticaton Token Expired!" });
        req.user = dbToken === null || dbToken === void 0 ? void 0 : dbToken.user;
    }
    catch (e) {
        console.error(e);
        return res.sendStatus(400);
    }
    next();
});
exports.default = authenticationLayer;
