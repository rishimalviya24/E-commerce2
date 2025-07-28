import { body } from "express-validator";
import redis from "../services/redis.service.js";
import userModel from "../models/user.js";

export const registerUserValidation = [
  body("username")
    .isString()
    .withMessage("Username must be a string")
    .isLength({ min: 3, max: 15 })
    .withMessage("Username must be between 3 and 15 characters")
    .isLowercase()
    .withMessage("Username must be lowercase"),
  body("email")
    .isEmail()
    .withMessage("Email must be a valid email")
    .normalizeEmail(),
  body("password")
    .isString()
    .withMessage("Password must be a string")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters"),
];

export const loginUserValidation = [
  body("email")
    .isEmail()
    .withMessage("Email must be a valid email")
    .normalizeEmail(),
  body("password")
    .isString()
    .withMessage("Password must be a string")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters"),
];

export const authUser = async (req, res, next) => {
  try {
    const token = req.cookies.token || req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "Unauthorized - Token missing" });
    }

    // Check if token is blacklisted
    const isTokenBlacklisted = await redis.get(`blacklist:${token}`);
    if (isTokenBlacklisted) {
      return res.status(401).json({ message: "Unauthorized - Token blacklisted" });
    }

    // Verify token
    const decoded = userModel.verifyToken(token); // contains _id, email, username

    // Try to get user from Redis cache
    let userJSON = await redis.get(`user:${decoded._id}`);
    let user;

    if (userJSON) {
      user = JSON.parse(userJSON);
    } else {
      user = await userModel.findById(decoded._id).lean(); // .lean() gives plain JS object
      if (!user) {
        return res.status(404).json({ message: "Unauthorized - User not found" });
      }
      delete user.password;

      // Store in Redis for 1 hour
      await redis.set(`user:${decoded._id}`, JSON.stringify(user), { EX: 3600 });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error("Authentication error:", error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
};