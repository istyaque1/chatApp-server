import express from "express";
import { configDotenv } from "dotenv";
import connectDB from "./db_config/db.js";
import userRouter from "./routes/user.auth.js";
import messageRoute from "./routes/message.route.js";
import cors from "cors";
import { server, app } from "./socket.js";
// import path from "path";
// import { fileURLToPath } from "url";

configDotenv();
// const app = express();
app.use(express());
app.use(express.json());
app.use(cors());

app.use("/user", userRouter);
app.use("/user", messageRoute);

// const _filename = fileURLToPath(import.meta.url)
// const _dirname = path.dirname(_filename)
// app.use(express.static(path.join(_dirname,"/client/dist")))

// app.get("*", (req,res)=>{
//   res.sendFile(path.join(_dirname,"client","dist","index.html"))
// })

const port = process.env.PORT;
server.listen(port, () => {
  connectDB();
  console.log(`server is running on port ${port}...`);
});
