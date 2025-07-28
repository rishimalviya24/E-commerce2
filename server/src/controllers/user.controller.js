import userModel from "../models/user.js";
import { validationResult } from "express-validator";
import * as userService from "../services/user.service.js";

export const createUserController = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { username, email, password } = req.body;

    const user = await userService.createUser({ username, email, password });
    const token = user.generateToken();

    return res.status(201).json({ user, token }); // ✅ Correct response
  } catch (error) {
    console.log(error);
    return res.status(500).send(error.message);
  }
};

export const loginUserController = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { email, password } = req.body;

    const user = await userService.loginUser({ email, password });


    const token = user.generateToken();

    return res.status(201).json({ user, token }); // ✅ Correct response
  } catch (error) {
    console.log(error);
    return res.status(400).send(error.message);
  }
};

export const logoutUserController = async (req, res) => {

  const timeRemainingForToken = req.tokenData.exp*1000 - Date.now();
  
   await redis.set(`blacklist:${req.tokenData.token}`,true, 'Ex', Math.floor(timeRemainingForToken/1000));
  return res.status(200).json({ message: "Logged out successfully" });
   
}
