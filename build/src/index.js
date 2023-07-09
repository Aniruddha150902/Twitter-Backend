"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const tweetRoutes_1 = __importDefault(require("./routes/tweetRoutes"));
const authMiddleware_1 = __importDefault(require("./middlewareLayer/authMiddleware"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use("/user", authMiddleware_1.default, userRoutes_1.default);
app.use("/auth", authRoutes_1.default);
app.use("/tweet", authMiddleware_1.default, tweetRoutes_1.default);
app.get("/", (req, res) => {
    res.send("<h1>TWITTER CLONE</h1>");
});
app.listen(3000, () => {
    console.log("server started on localhost");
});
