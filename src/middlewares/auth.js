require('dotenv').config(); // Load .env first

const jwt = require('jsonwebtoken');
const { readData } = require('../utils/fileHandler');

const USERS_FILE = 'users.json';

exports.userAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    console.log("authHeader:", authHeader);

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Authorization token missing or invalid" });
    }

    const token = authHeader.split(" ")[1];
    const JWT_SECRET = process.env.JWT_SECRET;

    if (!JWT_SECRET) {
      throw new Error("JWT_SECRET not loaded from .env");
    }

    const decoded = jwt.verify(token, JWT_SECRET);

    const users = await readData(USERS_FILE);
    const user = users.find(u => u.email === decoded.email);

    if (!user) {
      return res.status(401).json({ message: "Unauthorized: User not found" });
    }

    req.user = {
      userId: user.id,
      email: user.email
    };

    next();
  } catch (error) {
    console.error("Authentication error:", error.message);
    return res.status(403).json({ message: "Forbidden or invalid token" });
  }
};
