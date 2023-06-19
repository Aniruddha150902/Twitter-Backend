import express, { Router } from "express";
import userRoutes from "./routes/userRoutes";
import authRoutes from "./routes/authRoutes";
import tweetRoutes from "./routes/tweetRoutes";
import authenticationLayer from "./middlewarelayer/authMiddleware";
const app = express();
app.use(express.json());
app.use("/user", authenticationLayer, userRoutes);
app.use("/auth", authenticationLayer, authRoutes);
app.use("/tweet", authenticationLayer, tweetRoutes);
app.get("/", (req, res) => {
  res.send("<h1>Hello World! updated</h1>");
});
app.listen(3000, () => {
  console.log("server started on localhost");
});
