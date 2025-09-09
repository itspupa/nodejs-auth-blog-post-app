import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import postRouter from "./apps/posts.js";
import { client } from "./utils/db.js";
import authRouter from "./apps/auth.js";
import dotenv from "dotenv";

async function init() {
  dotenv.config();

  const app = express();
  const port = 4000;

  await client.connect();
  app.use(cors());
  app.use(bodyParser.json());
  app.use("/posts", postRouter);
  app.use("/auth", authRouter);

  app.get("/", (req, res) => {
    res.send("Hello World!");
  });
  // จัดการข้อผิดพลาดส่วนกลางสำหรับ JSON ไม่ถูกต้องและข้อผิดพลาดอื่นๆ
  app.use((err, req, res, next) => {
    if (err && (err.type === "entity.parse.failed" || err instanceof SyntaxError)) {
      return res.status(400).json({ message: "Invalid JSON payload" });
    }
    return res.status(500).json({ message: "Internal server error" });
  });
  app.get("*", (req, res) => {
    res.status(404).send("Not found");
  });
  app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
  });
}
init();