import jwt from "jsonwebtoken";

// 🐨 Todo: Exercise #5
// สร้าง Middleware ขึ้นมา 1 อันชื่อ Function ว่า `protect`
// เพื่อเอาไว้ตรวจสอบว่า Client แนบ Token มาใน Header ของ Request หรือไม่

function protect(req, res, next) {
  try {
    const authHeader = req.headers["authorization"] || req.headers["Authorization"]; 
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Token has invalid format" });
    }
    const token = authHeader.split(" ")[1];
    try {
      const payload = jwt.verify(token, process.env.SECRET_KEY || "dev-secret-123");
      req.user = payload;
      return next();
    } catch (e) {
      return res.status(401).json({ message: "Token is invalid" });
    }
  } catch (e) {
    return res.status(401).json({ message: "Token is invalid" });
  }
}

export default protect;
