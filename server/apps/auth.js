import { Router } from "express";
import { db } from "../utils/db.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const authRouter = Router();

// 🐨 Todo: Exercise #1
// ให้สร้าง API เพื่อเอาไว้ Register ตัว User แล้วเก็บข้อมูลไว้ใน Database ตามตารางที่ออกแบบไว้
authRouter.post("/register", async (req, res) => {
 try {
  const user = {
      username: req.body.username,
      password: req.body.password,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
  };

  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt)

  const collection = db.collection("users");
  await collection.insertOne(user);

  return res.json({
      message: "User has been created successfully.",
  });
} catch (e) {
  console.error(e);
  return res.json({
      message: `register ${e}`,
  });
}
});

// 🐨 Todo: Exercise #3
// ให้สร้าง API เพื่อเอาไว้ Login ตัว User ตามตารางที่ออกแบบไว้
authRouter.post("/login", async (req, res) => {
try {
  const user = await db.collection("users").findOne({
      username: req.body.username
  })

  if (!user) {
      return res.status(404).json({
          "message": "user not found"
      })
  }

  const isValidPassword = await bcrypt.compare(req.body.password, user.password);

  if (!isValidPassword) {
      return res.status(401).json({
          "message": "password not valid"
      })
  } else {
      const token = jwt.sign(
          {
              id: user.id,
              firstName: user.firstName,
              lastName: user.lastName
          },
          process.env.SECRET_KEY || "dev-secret-123",
          {
              expiresIn: '900000',
          }
      );

      return res.status(200).json({
          "message": "login successfully",
          "token": token
      })
  }
} catch (e) {
  console.error(e);
  return res.json({
      message: `login ${e}`,
  });
}
});

export default authRouter;