import express from "express";
import { configDotenv } from "dotenv";
import connectDB from "./db_config/db.js";
import userRouter from "./routes/user.auth.js";
import messageRoute from "./routes/message.route.js";
import cors from "cors";
import { server, app } from "./socket.js";
import resetRoute from "./routes/reset.route.js";

configDotenv();
// const app = express();
app.use(express());
app.use(express.json());
app.use(cors());

app.use("/user", userRouter);
app.use("/user", messageRoute);
app.use("/user", resetRoute);

const port = process.env.PORT;
server.listen(port, () => {
  connectDB();
  console.log(`server is running on port ${port}...`);
});
